 const usuarioId = 1; // ou vindo do backend

// Buscar pontos do usuário
async function carregarPontos() {
  try {
    const res = await fetch(`/fidelidade/pontos/${idUsuario}`);
    const data = await res.json();
    document.getElementById("pontos").textContent = data.pontos;
  } catch (error) {
    console.error("Erro ao carregar pontos:", error);
  }
}

// Trocar pontos por prêmio
async function trocarPorPremio(idUsuario, custo) {
  try {
    const res = await fetch(`/fidelidade/trocar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_usuario: idUsuario, custo: custo }),
    });

    const data = await res.json();
    const mensagem = document.getElementById("mensagem");

    if (data.sucesso) {
      mensagem.textContent = "✅ Troca realizada com sucesso!";
      carregarPontos();
    } else {
      mensagem.textContent = "❌ Pontos insuficientes para essa troca.";
    }
  } catch (error) {
    console.error("Erro ao trocar pontos:", error);
  }
}
