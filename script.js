let projetoAtualIndex = null;
let filtroAtual = 'Todos';

if (!localStorage.getItem('userPIN')) localStorage.setItem('userPIN', '1234');

function verificarPIN() {
    const input = document.getElementById("pinInput").value;
    if (input === localStorage.getItem('userPIN') || input === "1234") {
        document.getElementById("telaLock").style.display = "none";
        document.getElementById("appBody").style.display = "block";
        carregarProjetos();
    } else { alert("PIN Incorreto!"); }
}

function carregarProjetos() {
    let p = JSON.parse(localStorage.getItem('meusProjetos') || "[]");
    const termoBusca = document.getElementById("inputBusca").value.toLowerCase();
    const div = document.getElementById("listaTarefas");
    div.innerHTML = "";

    // Lógica de Filtro e Busca combinada
    const filtrados = p.filter(obj => {
        const correspondeFiltro = (filtroAtual === 'Todos' || obj.categoria === filtroAtual);
        const correspondeBusca = obj.texto.toLowerCase().includes(termoBusca);
        return correspondeFiltro && correspondeBusca;
    });

    filtrados.forEach((obj, i) => {
        // Encontrar o index real no array original
        const realIndex = p.indexOf(obj);
        div.innerHTML += `
            <div class="projeto-item" onclick="abrirProjeto(${realIndex})">
                <div><small style="color:var(--cor-principal)">${obj.categoria}</small><br><strong>${obj.texto}</strong></div>
                <span onclick="event.stopPropagation(); apagar(${realIndex})" style="color:#ff5555; padding:5px;">✖</span>
            </div>`;
    });
}

function filtrar(categoria, btn) {
    filtroAtual = categoria;
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    carregarProjetos();
}

function adicionarTarefa() {
    let input = document.getElementById("inputTarefa");
    let cat = document.getElementById("selectCategoria").value;
    if (!input.value.trim()) return;
    let p = JSON.parse(localStorage.getItem('meusProjetos') || "[]");
    p.push({ texto: input.value, categoria: cat, notas: "" });
    localStorage.setItem('meusProjetos', JSON.stringify(p));
    input.value = "";
    carregarProjetos();
}

function abrirProjeto(i) {
    projetoAtualIndex = i;
    const p = JSON.parse(localStorage.getItem('meusProjetos') || "[]");
    document.getElementById("telaPrincipal").style.display = "none";
    document.getElementById("telaProjeto").style.display = "block";
    document.getElementById("tituloProjeto").innerText = p[i].texto;
    document.getElementById("notasProjeto").innerHTML = p[i].notas || "";
}

function fecharProjeto() {
    document.getElementById("telaPrincipal").style.display = "block";
    document.getElementById("telaProjeto").style.display = "none";
    document.body.classList.remove("foco-ativo");
}

function salvarNotas() {
    let p = JSON.parse(localStorage.getItem('meusProjetos') || "[]");
    p[projetoAtualIndex].notas = document.getElementById("notasProjeto").innerHTML;
    localStorage.setItem('meusProjetos', JSON.stringify(p));
}

function execCmd(cmd, val = null) {
    document.execCommand(cmd, false, val);
    salvarNotas();
}

function toggleFoco() {
    document.body.classList.toggle("foco-ativo");
}

function apagar(i) {
    if(confirm("Remover este projeto?")) {
        let p = JSON.parse(localStorage.getItem('meusProjetos') || "[]");
        p.splice(i, 1);
        localStorage.setItem('meusProjetos', JSON.stringify(p));
        carregarProjetos();
    }
}

function resetTotal() {
    if (confirm("Reset de Fábrica? Apagará tudo.")) {
        localStorage.clear();
        location.reload();
    }
}

function configurarNovoPIN() {
    const novo = prompt("Novo PIN:");
    if(novo) localStorage.setItem('userPIN', novo);
}

function gerarBackup() {
    const blob = new Blob([localStorage.getItem('meusProjetos')], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'NTS_Backup.json';
    a.click();
}

function importarBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = ev => {
            localStorage.setItem('meusProjetos', ev.target.result);
            carregarProjetos();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}

function exportarParaTxt() {
    const txt = document.getElementById("notasProjeto").innerText;
    const blob = new Blob([txt], {type: "text/plain"});
    const a = document.createElement("a");
    a.download = "notas.txt";
    a.href = URL.createObjectURL(blob);
    a.click();
}
