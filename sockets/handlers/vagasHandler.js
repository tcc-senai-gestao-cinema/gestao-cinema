// sockets/handlers/vagasHandler.js
const Vaga = require('../../models/Vaga');

module.exports = async (io, socket) => {
  console.log(`📍 Handler de vagas inicializado para: ${socket.identificador}`);

  // Cliente pede as vagas de uma sala específica
  socket.on('solicitarVagas', async (idLocal) => {
    try {
      console.log(`🔍 ${socket.identificador} solicitou vagas do local: ${idLocal}`);
      
      const vagas = await Vaga.findAll({ 
        where: { id_local_de_exibicao: idLocal },
        attributes: ['id_vaga', 'nome', 'categoria', 'tipo', 'status', 'pos_x', 'pos_y', 'andar', 'reserva_data'],
        order: [['pos_y', 'ASC'], ['pos_x', 'ASC']]
      });
      
      console.log(`✅ Enviando ${vagas.length} vagas para: ${socket.identificador}`);
      socket.emit('vagasAtuais', vagas);
      
      // Juntar o usuário a uma sala específica para atualizações em tempo real
      const sala = `local_${idLocal}`;
      socket.join(sala);
      console.log(`👥 ${socket.identificador} entrou na sala: ${sala}`);
      
    } catch (error) {
      console.error(`❌ Erro ao buscar vagas para ${socket.identificador}:`, error);
      socket.emit('erro', { 
        tipo: 'ERRO_VAGAS', 
        mensagem: 'Erro ao carregar assentos. Tente novamente.' 
      });
    }
  });

  // Cliente tenta selecionar/reservar uma vaga temporariamente
  socket.on('selecionarVaga', async ({ idVaga }) => {
    try {
      console.log(`🎯 ${socket.identificador} tentando selecionar vaga: ${idVaga}`);
      
      // Buscar a vaga atual
      const vaga = await Vaga.findByPk(idVaga);
      
      if (!vaga) {
        socket.emit('erro', { 
          tipo: 'VAGA_NAO_ENCONTRADA', 
          mensagem: 'Assento não encontrado.' 
        });
        return;
      }
      
      // Verificar se a vaga está disponível
      if (vaga.status !== 'disponível') {
        socket.emit('erro', { 
          tipo: 'VAGA_INDISPONIVEL', 
          mensagem: `O assento ${vaga.nome} não está mais disponível.` 
        });
        return;
      }
      
      // Atualizar status para reservado temporariamente
      const [linhasAfetadas] = await Vaga.update(
        { 
          status: 'reservado', 
          reserva_data: new Date() 
        },
        { 
          where: { 
            id_vaga: idVaga, 
            status: 'disponível' 
          } 
        }
      );
      
      if (linhasAfetadas === 0) {
        // Outra pessoa selecionou primeiro
        socket.emit('erro', { 
          tipo: 'VAGA_JA_SELECIONADA', 
          mensagem: `O assento ${vaga.nome} foi selecionado por outro usuário.` 
        });
        return;
      }
      
      // Buscar a vaga atualizada
      const vagaAtualizada = await Vaga.findByPk(idVaga);
      
      console.log(`✅ ${socket.identificador} selecionou vaga: ${vaga.nome}`);
      
      // Notificar todos os usuários na mesma sala sobre a mudança
      const sala = `local_${vaga.id_local_de_exibicao}`;
      io.to(sala).emit('vagaAtualizada', vagaAtualizada);
      
    } catch (error) {
      console.error(`❌ Erro ao selecionar vaga para ${socket.identificador}:`, error);
      socket.emit('erro', { 
        tipo: 'ERRO_SELECAO', 
        mensagem: 'Erro ao selecionar assento. Tente novamente.' 
      });
    }
  });

  // Cliente confirma a vaga (pagamento realizado)
  socket.on('confirmarVaga', async ({ idVaga }) => {
    try {
      console.log(`💰 ${socket.identificador} confirmando vaga: ${idVaga}`);
      
      // Buscar a vaga
      const vaga = await Vaga.findByPk(idVaga);
      
      if (!vaga) {
        socket.emit('erro', { 
          tipo: 'VAGA_NAO_ENCONTRADA', 
          mensagem: 'Assento não encontrado.' 
        });
        return;
      }
      
      // Atualizar status para ocupado
      const [linhasAfetadas] = await Vaga.update(
        { status: 'ocupado' },
        { where: { id_vaga: idVaga } }
      );
      
      if (linhasAfetadas === 0) {
        socket.emit('erro', { 
          tipo: 'ERRO_CONFIRMACAO', 
          mensagem: 'Não foi possível confirmar o assento.' 
        });
        return;
      }
      
      const vagaAtualizada = await Vaga.findByPk(idVaga);
      
      console.log(`✅ ${socket.identificador} confirmou vaga: ${vaga.nome}`);
      
      // Notificar todos os usuários na sala
      const sala = `local_${vaga.id_local_de_exibicao}`;
      io.to(sala).emit('vagaAtualizada', vagaAtualizada);
      
      // Confirmar para o cliente que fez a ação
      socket.emit('vagaConfirmada', { 
        id_vaga: idVaga, 
        nome: vaga.nome,
        mensagem: `Assento ${vaga.nome} confirmado com sucesso!` 
      });
      
    } catch (error) {
      console.error(`❌ Erro ao confirmar vaga para ${socket.identificador}:`, error);
      socket.emit('erro', { 
        tipo: 'ERRO_CONFIRMACAO', 
        mensagem: 'Erro ao confirmar assento. Tente novamente.' 
      });
    }
  });

  // Cliente cancela a seleção da vaga
  socket.on('cancelarVaga', async ({ idVaga }) => {
    try {
      console.log(`❌ ${socket.identificador} cancelando vaga: ${idVaga}`);
      
      // Buscar a vaga
      const vaga = await Vaga.findByPk(idVaga);
      
      if (!vaga) {
        socket.emit('erro', { 
          tipo: 'VAGA_NAO_ENCONTRADA', 
          mensagem: 'Assento não encontrado.' 
        });
        return;
      }
      
      // Liberar a vaga (voltar para disponível)
      await Vaga.update(
        { 
          status: 'disponível', 
          reserva_data: null 
        },
        { where: { id_vaga: idVaga } }
      );
      
      const vagaAtualizada = await Vaga.findByPk(idVaga);
      
      console.log(`🔄 ${socket.identificador} cancelou vaga: ${vaga.nome}`);
      
      // Notificar todos os usuários na sala
      const sala = `local_${vaga.id_local_de_exibicao}`;
      io.to(sala).emit('vagaAtualizada', vagaAtualizada);
      
    } catch (error) {
      console.error(`❌ Erro ao cancelar vaga para ${socket.identificador}:`, error);
      socket.emit('erro', { 
        tipo: 'ERRO_CANCELAMENTO', 
        mensagem: 'Erro ao cancelar assento. Tente novamente.' 
      });
    }
  });

  // Limpeza automática de reservas expiradas (opcional)
  socket.on('limparReservasExpiradas', async ({ idLocal }) => {
    try {
      const tempoLimite = new Date(Date.now() - 15 * 60 * 1000); // 15 minutos atrás
      
      const vagasExpiradas = await Vaga.findAll({
        where: {
          id_local_de_exibicao: idLocal,
          status: 'reservado',
          reserva_data: { [require('sequelize').Op.lt]: tempoLimite }
        }
      });
      
      if (vagasExpiradas.length > 0) {
        await Vaga.update(
          { status: 'disponível', reserva_data: null },
          {
            where: {
              id_local_de_exibicao: idLocal,
              status: 'reservado',
              reserva_data: { [require('sequelize').Op.lt]: tempoLimite }
            }
          }
        );
        
        console.log(`🧹 Limpeza automática: ${vagasExpiradas.length} reservas expiradas no local ${idLocal}`);
        
        // Notificar sobre as vagas liberadas
        const sala = `local_${idLocal}`;
        for (const vaga of vagasExpiradas) {
          const vagaAtualizada = await Vaga.findByPk(vaga.id_vaga);
          io.to(sala).emit('vagaAtualizada', vagaAtualizada);
        }
      }
    } catch (error) {
      console.error('❌ Erro na limpeza de reservas expiradas:', error);
    }
  });

  // Quando o usuário se desconecta, liberar suas reservas temporárias
  socket.on('disconnect', async () => {
    try {
      console.log(`👋 ${socket.identificador} desconectado, liberando reservas...`);
      
      // Aqui você poderia implementar uma lógica mais sofisticada
      // Por exemplo, manter um registro das vagas reservadas por cada socket
      // e liberá-las quando o usuário se desconectar
      
      // Por enquanto, vamos apenas logar a desconexão
      console.log(`🔍 Verificando reservas pendentes para: ${socket.identificador}`);
      
    } catch (error) {
      console.error(`❌ Erro ao limpar reservas na desconexão:`, error);
    }
  });
};
