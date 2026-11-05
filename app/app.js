// Estuda — revisão inteligente, desempenho e sugestões de temas.
const SUPABASE_URL = "https://xxzqrirkxqifnfghftjl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_cyTTXR1jZlkMW0pijBmGcw_pja9779C";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = id => document.getElementById(id);
let user=null, sets=[], cards=[], folders=[], libraryItems=[], librarySearchResults=[], currentSet=null, currentFolder=null, page="home", authMode="login";
let studyCards=[], studyIndex=0, flipped=false, quizMode=false, quizAnswered=false, sessionCorrect=0, sessionWrong=0, retryAdded=new Set(), answeredInSession=new Set(), previousIndex=-1;
const shuffle = a => [...a].sort(()=>Math.random()-.5);
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const due = c => !c.due_at || new Date(c.due_at).getTime()<=Date.now();
const attempts = c => Number(c.attempts||0);
const accuracy = c => attempts(c) ? Math.round(Number(c.correct_count||0)/attempts(c)*100) : null;
function toast(msg){$("toast").textContent=msg;$("toast").classList.remove("hidden");clearTimeout(toast.timer);toast.timer=setTimeout(()=>$("toast").classList.add("hidden"),3000)}
function errMsg(e){return e?.message||"Ocorreu um erro. Tente novamente."}
function showPage(name){page=name;["home","detail","study","review","insights","folders","folderDetail","favorites","libraries"].forEach(id=>$(id+"Page").classList.toggle("hidden",id!==name));document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===name));if(name==="home")renderDashboard();if(name==="review")renderReview();if(name==="insights")renderInsights();if(name==="folders")renderFolders();if(name==="folderDetail")renderFolderDetail();if(name==="favorites")renderFavorites();if(name==="libraries")renderLibraries()}
async function loadData(){const [s,c,f,l]=await Promise.all([sb.from("study_sets").select("*").order("updated_at",{ascending:false}),sb.from("study_cards").select("*").order("position"),sb.from("study_folders").select("*").order("name"),sb.from("study_library_items").select("*").order("imported_at",{ascending:false})]);if(s.error||c.error||f.error||l.error)throw s.error||c.error||f.error||l.error;sets=s.data||[];cards=c.data||[];folders=f.data||[];libraryItems=l.data||[];renderDashboard()}
function setCards(id){return cards.filter(c=>c.set_id===id)}
function renderDashboard(){
 const total=cards.length, dueCards=cards.filter(due), tried=cards.filter(c=>attempts(c)>0), totalAttempts=cards.reduce((n,c)=>n+attempts(c),0), correct=cards.reduce((n,c)=>n+Number(c.correct_count||0),0), mastered=cards.filter(c=>Number(c.mastery_level||0)>=3).length;
 $("statDue").textContent=dueCards.length;$("statAccuracy").textContent=totalAttempts?Math.round(correct/totalAttempts*100)+"%":"—";$("statAttempts").textContent=totalAttempts;$("statMastered").textContent=mastered;
 $("reviewSubtitle").textContent=dueCards.length?dueCards.length+" cartões estão prontos para revisão.":"Tudo em dia! Você pode estudar um conjunto ou explorar um tema novo.";
 $("duePreview").innerHTML=dueCards.length?dueCards.slice(0,4).map(c=>'<div style="display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--line)"><span>'+esc(c.question)+'</span><span class="pill">'+esc(sets.find(s=>s.id===c.set_id)?.title||"Conjunto")+'</span></div>').join(""):'<div class="small muted">Nenhum cartão vencido neste momento. Continue praticando para manter a memória ativa.</div>';
 $("startDueHome").disabled=!dueCards.length;
 renderSets();
}
function renderSets(list=sets){$("setsGrid").innerHTML=list.length?list.map(s=>{const cs=setCards(s.id), folder=folders.find(f=>f.id===s.folder_id), d=cs.filter(due).length;return '<article class="set-card" data-open="'+s.id+'"><span class="tag">'+esc(folder?.name||"Conjunto")+'</span><h3>'+esc(s.title)+'</h3><div class="muted small">'+esc(s.description||"Sem descrição")+'</div><div class="set-meta"><span>'+cs.length+' cartões · '+d+' para revisar</span><span>Abrir →</span></div></article>'}).join(""):'<div class="empty"><h3>Vamos começar?</h3><p>Crie uma pasta para organizar seus estudos ou comece por um conjunto.</p><button class="primary" id="emptyCreate">Criar conjunto</button></div>';document.querySelectorAll("[data-open]").forEach(el=>el.onclick=()=>openSet(el.dataset.open));const b=$("emptyCreate");if(b)b.onclick=openSetModal}
function openSet(id){currentSet=sets.find(s=>s.id===id);if(!currentSet)return;showPage("detail");$("detailTitle").textContent=currentSet.title;$("detailDesc").textContent=currentSet.description||"Sem descrição";renderCards()}
function renderCards(){const list=setCards(currentSet.id);$("cardCount").textContent=list.length+" cartões · "+list.filter(due).length+" para revisar";$("startSetDue").disabled=!list.some(due);$("cardsList").innerHTML=list.length?list.map(c=>'<div class="card-row"><p><strong>'+esc(c.question)+'</strong><div class="small muted">'+esc(c.answer)+'</div></p><div><span class="pill">'+(attempts(c)?accuracy(c)+'% de acerto':'Novo')+'</span><div class="small muted" style="margin-top:5px">'+(c.due_at&&due(c)?"Pendente":Number(c.mastery_level||0)>=3?"Bem aprendido":"Em aprendizagem")+'</div></div><div class="actions"><button class="plain" data-fav="'+c.id+'">'+(c.is_favorite?"★":"☆")+'</button><button class="plain" data-editcard="'+c.id+'">Editar</button><button class="danger" data-delcard="'+c.id+'">Excluir</button></div></div>').join(""):'<div class="empty">Adicione seu primeiro cartão ou use um tema sugerido.</div>';document.querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.fav));document.querySelectorAll("[data-editcard]").forEach(b=>b.onclick=()=>openCardModal(b.dataset.editcard));document.querySelectorAll("[data-delcard]").forEach(b=>b.onclick=()=>deleteCard(b.dataset.delcard))}
function openModal(title,html){$("modalTitle").textContent=title;$("modalBody").innerHTML=html;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
function openSetModal(folderId=null){
 openModal("Criar conjunto",'<form id="setForm"><div class="field"><label>Nome do assunto ou conjunto</label><input name="title" required maxlength="120" placeholder="Ex.: Excel, JavaScript, Direito..."></div><div class="field" style="margin-top:12px"><label>Descrição</label><textarea name="description" placeholder="O que você vai estudar?"></textarea></div><div class="field" style="margin-top:12px"><label>Pasta</label><select name="folder_id"><option value="">Sem pasta</option>'+folders.map(f=>'<option value="'+f.id+'" '+(f.id===folderId?"selected":"")+'">'+esc(f.name)+'</option>').join("")+'</select></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="soft" id="cancelModal">Cancelar</button><button class="primary">Salvar conjunto</button></div></form>');
 const form=$("setForm");$("cancelModal").onclick=closeModal;
 form.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const {data,error}=await sb.from("study_sets").insert({user_id:user.id,title:d.title.trim(),description:(d.description||"").trim(),folder_id:d.folder_id||null}).select().single();if(error)return toast(errMsg(error));sets.unshift(data);closeModal();renderDashboard();openSet(data.id);toast("Conjunto criado!")};
}
function buildCardSuggestions(set){
 const topic=(set?.title||"").trim();
 const raw=(topic+" "+(set?.description||"")).toLocaleLowerCase("pt-BR");
 const t=raw.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"");
 const groups=[
  {keys:["anatomia animal","anatomia veterinaria","anatomia dos animais"],cards:[
   ["O que é Anatomia Animal?","É a área que estuda a forma, a estrutura, a localização e as relações entre as partes do corpo dos animais."],
   ["Qual é a diferença entre Anatomia e Fisiologia?","Anatomia estuda a estrutura e a organização do corpo; Fisiologia estuda como essas estruturas funcionam."],
   ["O que é posição anatômica?","É uma posição de referência padronizada que facilita descrever a localização e a orientação das estruturas do corpo animal."],
   ["O que são planos anatômicos?","São planos imaginários usados para dividir o corpo e descrever estruturas. Entre eles estão os planos mediano, sagital, dorsal e transversal."],
   ["O que é o plano mediano?","É o plano longitudinal que divide o corpo em metades direita e esquerda, aproximadamente iguais."],
   ["O que é osteologia?","É a parte da Anatomia que estuda os ossos, incluindo sua forma, localização, estrutura e classificação."],
   ["O que é artrologia?","É o estudo das articulações, isto é, das conexões entre dois ou mais ossos ou entre partes do esqueleto."],
   ["O que é miologia?","É a área da Anatomia que estuda os músculos, sua organização, localização e inserções."],
   ["Quais são as principais funções do sistema esquelético?","Sustentar o corpo, proteger órgãos, auxiliar nos movimentos, armazenar minerais e participar da formação de células sanguíneas na medula óssea."],
   ["Quais são os principais sistemas do corpo animal?","Entre eles estão os sistemas tegumentar, esquelético, muscular, nervoso, endócrino, circulatório, respiratório, digestório, urinário e reprodutor."],
   ["O que é Anatomia Comparada?","É o estudo das semelhanças e diferenças entre estruturas anatômicas de diferentes espécies animais."],
   ["O que significa Anatomia Sistêmica?","É o estudo do corpo organizado por sistemas, analisando os órgãos que trabalham em conjunto para desempenhar funções."]
  ]},
  {keys:["python"],cards:[
   ["O que é Python?","É uma linguagem de programação de alto nível, conhecida pela sintaxe legível e por sua versatilidade."],
   ["O que é uma variável em Python?","É um nome que referencia um valor armazenado durante a execução do programa."],
   ["Como criar uma variável em Python?","Basta atribuir um valor, por exemplo: nome = \"Ana\". Não é necessário declarar o tipo."],
   ["Quais são os tipos básicos de dados em Python?","Entre os principais estão int, float, str e bool."],
   ["Qual é a diferença entre int e float?","int representa números inteiros; float representa números com casas decimais."],
   ["Para que serve a função print()?","Exibe informações ou resultados no console."],
   ["Para que serve a função input()?","Recebe um dado digitado pelo usuário e retorna esse conteúdo como texto."],
   ["Como fazer uma condição em Python?","Use if, podendo combinar com elif e else para tratar alternativas."],
   ["Qual é a diferença entre for e while?","for percorre itens de uma sequência ou iterável; while repete enquanto uma condição for verdadeira."],
   ["O que é uma lista em Python?","É uma coleção ordenada e mutável que pode armazenar vários valores."],
   ["Como acessar um item de uma lista?","Use seu índice entre colchetes; o primeiro elemento fica no índice 0."],
   ["O que é uma tupla?","É uma coleção ordenada e imutável, normalmente escrita entre parênteses."],
   ["O que é um dicionário em Python?","É uma estrutura que armazena pares de chave e valor."],
   ["Para que serve uma função (def)?","Permite agrupar instruções reutilizáveis e pode receber parâmetros e retornar resultados."],
   ["Qual é a finalidade do return?","Encerra a chamada da função e devolve um resultado para quem a chamou."],
   ["O que é uma biblioteca em Python?","É um conjunto de módulos e recursos reutilizáveis que facilita a implementação de funcionalidades."],
   ["Para que serve try e except?","Permite tratar exceções e definir como o programa deve reagir a erros durante a execução."],
   ["O que significa pip?","É o instalador de pacotes usado para instalar e gerenciar bibliotecas Python."]
  ]},
  {keys:["sql","banco de dados","banco dados"],cards:[
   ["O que é SQL?","É uma linguagem usada para consultar e manipular dados em bancos de dados relacionais."],
   ["Para que serve SELECT?","Para consultar e retornar dados de uma ou mais tabelas."],
   ["Qual é a função do WHERE?","Filtra registros de acordo com uma condição."],
   ["Qual é a diferença entre INSERT e UPDATE?","INSERT adiciona registros; UPDATE altera registros existentes."],
   ["Para que serve DELETE?","Remove registros de uma tabela, conforme a condição informada."],
   ["O que é uma chave primária?","É uma coluna ou conjunto de colunas que identifica unicamente cada registro da tabela."],
   ["O que é uma chave estrangeira?","É uma coluna que referencia uma chave de outra tabela, relacionando os dados."],
   ["Para que serve o JOIN?","Combina linhas de tabelas relacionadas usando uma condição de junção."],
   ["Qual é a diferença entre INNER JOIN e LEFT JOIN?","INNER JOIN retorna correspondências nas duas tabelas; LEFT JOIN mantém todas as linhas da tabela à esquerda."],
   ["O que é normalização de dados?","É a organização das tabelas para reduzir redundâncias e evitar anomalias de inserção, atualização e exclusão."]
  ]},
  {keys:["javascript","js"],cards:[
   ["O que é JavaScript?","É uma linguagem de programação muito usada para adicionar comportamento e interatividade a páginas e aplicações."],
   ["Qual é a diferença entre let e const?","let permite reatribuir a variável; const impede a reatribuição do vínculo."],
   ["O que é uma função?","É um bloco reutilizável de código que pode receber parâmetros e retornar um valor."],
   ["O que é um array?","É uma estrutura ordenada usada para armazenar uma coleção de valores."],
   ["O que é um objeto em JavaScript?","É uma estrutura que organiza dados em propriedades associadas a valores."],
   ["Para que serve addEventListener?","Registra uma função para responder a um evento, como clique ou digitação."],
   ["O que é o DOM?","É a representação estruturada do documento HTML que permite acessar e alterar seus elementos."],
   ["O que é uma Promise?","É um objeto que representa a conclusão futura, bem-sucedida ou não, de uma operação assíncrona."],
   ["Para que serve async/await?","Simplifica a escrita de código assíncrono, permitindo aguardar uma Promise dentro de uma função async."],
   ["Qual é a diferença entre == e ===?","== compara com conversão de tipos; === compara valor e tipo sem conversão."]
  ]},
  {keys:["html"],cards:[
   ["O que é HTML?","É a linguagem de marcação usada para estruturar o conteúdo de páginas web."],
   ["O que significa HTML?","HyperText Markup Language, ou Linguagem de Marcação de Hipertexto."],
   ["Para que serve a tag <h1>?","Define um título de nível principal na estrutura do documento."],
   ["Qual é a função da tag <p>?","Representa um parágrafo de texto."],
   ["Para que serve a tag <a>?","Cria um link para outra página, arquivo ou seção."],
   ["Qual é a função do atributo alt em imagens?","Fornece um texto alternativo que descreve a imagem."],
   ["O que é HTML semântico?","É o uso de elementos que comunicam o significado e a função do conteúdo, como header, nav, main e footer."]
  ]},
  {keys:["css"],cards:[
   ["O que é CSS?","É a linguagem usada para definir a apresentação visual de documentos HTML."],
   ["O que significa CSS?","Cascading Style Sheets, ou Folhas de Estilo em Cascata."],
   ["Qual é a diferença entre class e id no CSS?","class pode ser reutilizada em vários elementos; id identifica um elemento específico no documento."],
   ["O que é o modelo de caixa (box model)?","É o modelo que considera conteúdo, padding, borda e margem de um elemento."],
   ["Para que serve display: flex?","Ativa o Flexbox, facilitando o alinhamento e a distribuição de elementos em uma dimensão."],
   ["Para que serve uma media query?","Aplica estilos conforme características do dispositivo ou da tela, como a largura."]
  ]},
  {keys:["logica","algoritmo"],cards:[
   ["O que é um algoritmo?","É uma sequência finita e ordenada de passos para resolver um problema ou executar uma tarefa."],
   ["O que é uma variável?","É um espaço identificado usado para armazenar ou referenciar um valor."],
   ["O que é uma estrutura condicional?","É uma estrutura que escolhe qual caminho executar com base em uma condição."],
   ["Para que serve um laço de repetição?","Para executar um bloco de instruções várias vezes, conforme uma sequência ou condição."],
   ["O que é pseudocódigo?","É uma forma simplificada e independente de linguagem para descrever os passos de um algoritmo."],
   ["O que é uma estrutura de dados?","É uma forma de organizar e armazenar dados para permitir seu uso eficiente."]
  ]},
  {keys:["ingles","english"],cards:[
   ["O que significa 'usually'?","Geralmente; normalmente."],
   ["Qual é o passado do verbo 'go'?","Went."],
   ["Como se diz 'bom dia' em inglês?","Good morning."],
   ["Quando usar 'do' e 'does'?","Do acompanha I, you, we e they; does acompanha he, she e it no presente simples."],
   ["Qual é a diferença entre 'much' e 'many'?","Much é usado com substantivos incontáveis; many com substantivos contáveis no plural."]
  ]},
  {keys:["matematica"],cards:[
   ["Como calcular porcentagem de um valor?","Converta a porcentagem em decimal e multiplique pelo valor. Ex.: 10% = 0,10."],
   ["O que é uma fração?","É uma representação de partes de um todo, expressa por numerador e denominador."],
   ["Como calcular a média aritmética?","Some todos os valores e divida pela quantidade de valores."],
   ["O que são números primos?","São números naturais maiores que 1 que possuem exatamente dois divisores positivos: 1 e eles mesmos."],
   ["O que é uma equação?","É uma igualdade matemática que contém uma ou mais incógnitas."]
  ]},
  {keys:["engenharia de software","requisitos de software"],cards:[
   ["O que é engenharia de software?","É a aplicação sistemática de métodos, técnicas e ferramentas para desenvolver e manter software."],
   ["O que é um requisito funcional?","Descreve uma função ou comportamento que o sistema deve oferecer."],
   ["O que é um requisito não funcional?","Define atributos ou restrições de qualidade, como desempenho, segurança e usabilidade."],
   ["Para que serve a UML?","Para visualizar, especificar, construir e documentar elementos de sistemas."],
   ["O que é um teste de software?","É uma atividade que avalia o sistema para identificar defeitos e verificar se atende aos requisitos."],
   ["O que é controle de versão?","É o registro das alterações feitas em arquivos ao longo do tempo, permitindo acompanhar e recuperar versões."]
  ]},
  {keys:["biologia","ciencias"],cards:[
   ["O que é uma célula?","É a unidade estrutural e funcional básica dos seres vivos."],
   ["Qual é a função do DNA?","Armazenar e transmitir informações genéticas."],
   ["O que é um ecossistema?","É o conjunto de seres vivos e fatores não vivos que interagem em determinada área."],
   ["O que é fotossíntese?","É o processo pelo qual organismos como plantas usam energia luminosa para produzir matéria orgânica a partir de água e dióxido de carbono."]
  ]},
  {keys:["historia"],cards:[
   ["O que são fontes históricas?","São vestígios e registros materiais ou imateriais utilizados para estudar e interpretar o passado."],
   ["Qual é a diferença entre causa e consequência histórica?","Causa ajuda a explicar por que um fato ocorreu; consequência é um resultado produzido por ele."],
   ["O que é contexto histórico?","É o conjunto de condições políticas, sociais, econômicas e culturais de uma época."]
  ]},
  {keys:["direito","constituicao"],cards:[
   ["O que é uma Constituição?","É a norma fundamental que organiza o Estado e estabelece direitos, garantias e limites ao poder."],
   ["O que é jurisprudência?","É o conjunto de decisões judiciais que orientam a interpretação e aplicação do direito."],
   ["O que é o princípio da legalidade?","Em linhas gerais, determina que a atuação estatal deve estar fundamentada na lei."]
  ]}
 ];
 const found=groups.find(g=>g.keys.some(k=>t.includes(k)));
 if(found)return found.cards.map(c=>({question:c[0],answer:c[1]}));
 return [];
}
 
function buildMoreCardSuggestions(set,shown=[]){
 const raw=((set?.title||"")+" "+(set?.description||"")).toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"");
 const banks=[
  {keys:["anatomia animal","anatomia veterinaria","anatomia dos animais"],cards:[
   ["O que é anatomia topográfica?","Estuda a localização e as relações entre estruturas em regiões específicas do corpo."],
   ["O que é anatomia macroscópica?","Estuda estruturas do corpo que podem ser observadas sem auxílio de microscópio."],
   ["O que é anatomia microscópica?","Analisa estruturas que exigem microscópio, como tecidos e células."],
   ["Qual é a função do sistema tegumentar?","Revestir e proteger o corpo, além de participar da percepção sensorial e da regulação térmica."],
   ["Qual é a função do sistema muscular?","Produzir movimentos, manter a postura e contribuir para a produção de calor."],
   ["Qual é a função do sistema nervoso?","Receber e processar informações e coordenar respostas do organismo."],
   ["O que são estruturas bilaterais?","São estruturas organizadas em pares, uma de cada lado do plano mediano."],
   ["O que significa proximal em Anatomia?","Indica uma estrutura mais próxima da origem de um membro ou ponto de referência."],
   ["O que significa distal em Anatomia?","Indica uma estrutura mais afastada da origem de um membro ou ponto de referência."],
   ["O que significa cranial?","Indica direção ou localização em sentido à cabeça do animal."],
   ["O que significa caudal?","Indica direção ou localização em sentido à cauda do animal."],
   ["O que é esqueleto axial?","É a parte do esqueleto que inclui principalmente crânio, coluna vertebral, costelas e esterno."],
   ["O que é esqueleto apendicular?","É formado pelos ossos dos membros e pelas estruturas que os conectam ao esqueleto axial."],
   ["Qual é a diferença entre tendão e ligamento?","Tendões ligam músculos a ossos; ligamentos conectam ossos e ajudam a estabilizar articulações."],
   ["O que é uma articulação sinovial?","É uma articulação móvel que possui cavidade articular, líquido sinovial e estruturas de revestimento."]
  ]},
  {keys:["python"],cards:[
   ["O que é indentação em Python?","É o recuo que define blocos de código, como o corpo de funções, condições e laços."],
   ["Para que serve len()?","Retorna a quantidade de elementos de uma sequência ou coleção."],
   ["Qual é a diferença entre append() e extend()?","append() adiciona um elemento; extend() adiciona individualmente os elementos de um iterável."],
   ["Para que serve range()?","Gera uma sequência de números, frequentemente usada em laços for."],
   ["O que é um módulo em Python?","É um arquivo Python que reúne código reutilizável, como funções, classes e variáveis."],
   ["O que é uma exceção?","É um evento de erro ou condição inesperada que interrompe o fluxo normal do programa."],
   ["Para que serve __init__?","É um método especial chamado na criação de uma instância de uma classe."],
   ["O que é uma classe em Python?","É uma estrutura que define atributos e comportamentos para criar objetos."],
   ["O que é list comprehension?","É uma forma concisa de criar listas a partir de iteráveis, podendo incluir condições."],
   ["Para que serve open()?","Abre um arquivo para leitura, escrita ou outros modos de acesso."]
  ]},
  {keys:["sql","banco de dados","banco dados"],cards:[
   ["Para que serve ORDER BY?","Ordena os resultados de uma consulta por uma ou mais colunas."],
   ["Para que serve GROUP BY?","Agrupa linhas que possuem valores iguais em determinadas colunas, geralmente com funções de agregação."],
   ["O que faz COUNT() no SQL?","Conta registros ou valores, conforme a expressão informada."],
   ["O que é uma transação no banco de dados?","É um conjunto de operações tratado como uma unidade de trabalho."],
   ["O que significa ACID?","Atomicidade, Consistência, Isolamento e Durabilidade: propriedades importantes de transações."],
   ["Para que serve o comando CREATE TABLE?","Cria uma nova tabela e define suas colunas e restrições."]
  ]},
  {keys:["javascript","js"],cards:[
   ["O que é escopo de variável?","É a região do código em que uma variável pode ser acessada."],
   ["O que é uma arrow function?","É uma forma concisa de escrever funções usando a sintaxe =>."],
   ["Para que serve JSON.stringify()?","Converte um valor JavaScript em uma string no formato JSON."],
   ["Para que serve JSON.parse()?","Converte uma string JSON em um valor JavaScript."],
   ["O que é event bubbling?","É a propagação de um evento de um elemento filho para seus elementos ancestrais."],
   ["O que significa null em JavaScript?","Representa intencionalmente a ausência de um valor de objeto."]
  ]},
  {keys:["html"],cards:[
   ["Para que serve a tag <form>?","Agrupa controles para coletar e enviar dados informados pelo usuário."],
   ["Qual é a função da tag <label>?","Associa um texto descritivo a um controle de formulário."],
   ["Para que serve a tag <section>?","Representa uma seção temática de conteúdo, normalmente com um título."]
  ]},
  {keys:["css"],cards:[
   ["O que é especificidade no CSS?","É o critério usado para resolver conflitos entre seletores que definem a mesma propriedade."],
   ["Para que serve z-index?","Controla a ordem de sobreposição de elementos posicionados."],
   ["Qual é a diferença entre margin e padding?","margin cria espaço externo; padding cria espaço interno entre conteúdo e borda."]
  ]}
 ];
 const found=banks.find(g=>g.keys.some(k=>raw.includes(k)));
 if(!found)return [];
 const seen=new Set(shown.map(c=>(c.question||"").toLocaleLowerCase("pt-BR").trim()));
 return found.cards.filter(c=>!seen.has(c[0].toLocaleLowerCase("pt-BR"))).map(c=>({question:c[0],answer:c[1]}));
}

async function addSuggestedCard(item,button){
 if(!currentSet)return;
 button.disabled=true;button.textContent="Adicionando...";
 const {error}=await sb.from("study_cards").insert({user_id:user.id,set_id:currentSet.id,question:item.question,answer:item.answer,position:setCards(currentSet.id).length});
 if(error){button.disabled=false;button.textContent="Adicionar cartão";return toast(errMsg(error))}
 await loadData();openSet(currentSet.id);openCardModal();toast("Cartão sugerido adicionado!");
}

function renderLibraries(){
 $("librarySaved").innerHTML=libraryItems.length?libraryItems.map(x=>'<article class="set-card"><span class="tag">Biblioteca pessoal</span><h3>'+esc(x.title)+'</h3><p class="small muted">'+esc((x.summary||x.content||"").slice(0,190))+'...</p><div class="set-meta"><span>'+esc(x.source_name||"Fonte pública")+'</span><div class="actions"><button class="soft" data-readlibrary="'+x.id+'">Estudar</button><button class="danger" data-dellibrary="'+x.id+'">Excluir</button></div></div></article>').join(""):'<div class="empty"><h3>Sua biblioteca está vazia</h3><p>Pesquise um assunto acima e salve materiais gratuitos para estudar e criar cartões.</p></div>';
 document.querySelectorAll("[data-readlibrary]").forEach(b=>b.onclick=()=>openLibraryItem(b.dataset.readlibrary));
 document.querySelectorAll("[data-dellibrary]").forEach(b=>b.onclick=async()=>{const item=libraryItems.find(x=>x.id===b.dataset.dellibrary);if(!item||!confirm('Excluir "'+item.title+'" da sua biblioteca?'))return;const {error}=await sb.from("study_library_items").delete().eq("id",item.id).eq("user_id",user.id);if(error)return toast(errMsg(error));await loadData();renderLibraries();toast("Material removido da biblioteca.")});
}
function libraryQueryVariants(raw){
 const clean=String(raw||"").trim(),lower=clean.toLocaleLowerCase("pt-BR");
 const stop=new Set(["conceito","conceitos","principal","principais","introducao","introdução","fundamento","fundamentos","estudo","estudos","sobre","de","da","do","das","dos","para","com","e","a","o","as","os","um","uma"]);
 const tokens=lower.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9\\s]/g," ").split(/\\s+/).filter(w=>w.length>2&&!stop.has(w));
 const variants=[clean,tokens.join(" ")];
 if(tokens.some(w=>w==="anatomia")&&tokens.some(w=>w==="animal")){
  variants.push('"anatomia animal"',"anatomia dos animais","anatomia veterinaria animal","anatomia comparada dos animais","sistemas do corpo dos animais");
 }
 if(tokens.some(w=>w==="python"))variants.push("linguagem de programação Python");
 return [...new Set(variants.map(x=>x.trim()).filter(x=>x.length>1))].slice(0,6);
}
function curatedLibrarySources(query){
 const raw=String(query||"").trim();
 const t=raw.toLocaleLowerCase("pt-BR");
 if(!raw)return [];
 const passeDiretoSearch="https://www.google.com/search?q="+encodeURIComponent("site:passeidireto.com "+raw);
 const infoEscolaSearch="https://www.google.com/search?q="+encodeURIComponent("site:infoescola.com "+raw);
 const passeDireto=[{title:"Pesquisar “"+raw+"” no Passei Direto",source_url:passeDiretoSearch,source_name:"Passei Direto · busca por assunto",summary:"Abre resultados indexados do Passei Direto para este tema. A disponibilidade de cada material depende das permissões e do acesso oferecido pela plataforma."}];
 const infoEscola=[{title:"Pesquisar “"+raw+"” no InfoEscola",source_url:infoEscolaSearch,source_name:"InfoEscola · busca por assunto",summary:"Busca artigos e conteúdos educacionais do InfoEscola relacionados ao tema. O link leva aos resultados encontrados no domínio do site."}];
 if(!/anatomia|veterin|animal/.test(t))return [...passeDireto,...infoEscola];
 return [...passeDireto,...infoEscola,
  {title:"Anatomia Animal — materiais e disciplina",source_url:"https://www.passeidireto.com/disciplina/anatomia-animal",source_name:"Passei Direto",summary:"Página da disciplina com materiais de estudo, documentos e conteúdos populares específicos de anatomia dos animais."},
  {title:"ANATOMIA ANIMAL Aula 1 — Introdução",source_url:"https://www.passeidireto.com/arquivo/166117443/anatomia-animal-aula-1-introducao",source_name:"Passei Direto",summary:"Prévia pública de aula com cronograma, osteologia, artrologia, miologia, sistema nervoso, tegumento, planos e eixos anatômicos."},
  {title:"Introdução à Anatomia Animal — UFPel",source_url:"https://www.passeidireto.com/arquivo/65121027/introducao-a-anatomia-animal",source_name:"Passei Direto · UFPel",summary:"Material introdutório sobre estrutura do corpo animal, anatomia macroscópica, anatomia comparada e anatomia sistemática."},
  {title:"Fundamentos da Anatomia Animal — material didático",source_url:"https://stecine.azureedge.net/repositorio/00212ti/200616/ptbr/index.html",source_name:"Material educacional",summary:"Conteúdo introdutório sobre fundamentos, organização do corpo animal, anatomia sistêmica e topográfica. Abra a fonte para consultar o material completo."},
  {title:"Anatomia Aplicada à Radiologia Veterinária",source_url:"https://stecine.azureedge.net/repositorio/anatomia_aplicada_a_radiologia_veterinaria/index.html",source_name:"Material educacional",summary:"Planos e eixos anatômicos, sistema locomotor e sistemas orgânicos dos animais vertebrados."},
  {title:"Atlas de Anatomia Veterinária — UAB/UFRA",source_url:"https://www.anatomiaveterinaria-uab-ufra.com/introducao",source_name:"UAB / UFRA",summary:"Atlas online com imagens e explicações de músculos, ossos, vasos sanguíneos, nervos e organização do organismo animal."},
  {title:"Anatomia Animal I — Universidade de São Paulo",source_url:"https://uspdigital.usp.br/jupiterweb/obterDisciplina?sgldis=ZMV1303",source_name:"Universidade de São Paulo",summary:"Ementa universitária com conceitos gerais, nomenclatura anatômica, osteologia, articulações, músculos e sistemas."},
  {title:"Programa de Anatomia Animal — Universidade Federal de Santa Catarina",source_url:"https://medicinaveterinaria.paginas.ufsc.br/files/2021/10/ABF7601-Anatomia-Animal-I.pdf",source_name:"Universidade Federal de Santa Catarina",summary:"Programa de disciplina com introdução, princípios de construção do corpo animal, planos, eixos e termos anatômicos."}
 ];
}
async function searchLibrary(){
 const query=$("libraryQuery").value.trim();if(query.length<2)return toast("Digite pelo menos duas letras para pesquisar.");
 const btn=$("librarySearchButton");btn.disabled=true;btn.textContent="Pesquisando...";$("libraryResults").innerHTML='<div class="panel small muted">Ampliando a pesquisa e consultando materiais gratuitos...</div>';
 try{
  const variants=libraryQueryVariants(query);
  const responses=await Promise.all(variants.map(async term=>{
   const url="https://pt.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch="+encodeURIComponent(term)+"&gsrnamespace=0&gsrlimit=6&prop=extracts%7Cinfo&explaintext=1&exchars=18000&inprop=url&format=json&origin=*";
   const response=await fetch(url);if(!response.ok)throw new Error("A fonte não respondeu.");
   const data=await response.json();return Object.values(data.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));
  }));
  const seen=new Set();
  librarySearchResults=responses.flat().filter(p=>p.extract&&p.extract.trim()).filter(p=>{const k=p.title.toLocaleLowerCase("pt-BR");if(seen.has(k))return false;seen.add(k);return true}).slice(0,12).map(p=>({title:p.title,content:p.extract,source_url:p.fullurl||("https://pt.wikipedia.org/wiki/"+encodeURIComponent(p.title.replace(/ /g,"_"))),source_name:"Wikipédia",summary:p.extract.slice(0,360)}));
  const refs=curatedLibrarySources(query).filter(x=>!libraryItems.some(saved=>saved.source_url===x.source_url));
  const wikiHtml=librarySearchResults.map((p,i)=>'<article class="set-card"><span class="tag">Wikipédia · português</span><h3>'+esc(p.title)+'</h3><p class="small muted">'+esc(p.summary)+'...</p><div class="set-meta"><span>Texto disponível para salvar</span><button class="primary" data-savelibrary="'+i+'">＋ Salvar na biblioteca</button></div></article>').join("");
  const refsHtml=refs.map((p,i)=>'<article class="set-card"><span class="tag">Fonte educacional</span><h3>'+esc(p.title)+'</h3><p class="small muted">'+esc(p.summary)+'</p><div class="set-meta"><span>'+esc(p.source_name)+'</span><a class="soft" href="'+esc(p.source_url)+'" target="_blank" rel="noopener">Abrir material ↗</a></div></article>').join("");
  $("libraryResults").innerHTML=(wikiHtml?'<h3>Conteúdos que você pode salvar</h3><div class="grid">'+wikiHtml+'</div>':'')+(refsHtml?'<h3>Materiais e fontes para aprofundar</h3><div class="grid">'+refsHtml+'</div>':'')+(!wikiHtml&&!refsHtml?'<div class="empty">Não encontrei materiais com esse termo. Experimente pesquisar pelo assunto principal, por exemplo: anatomia animal, sistema digestório ou osteologia.</div>':'');
  document.querySelectorAll("[data-savelibrary]").forEach(b=>b.onclick=()=>saveLibraryItem(Number(b.dataset.savelibrary),b));
 }catch(e){$("libraryResults").innerHTML='<div class="empty">Não foi possível pesquisar agora. Verifique sua conexão e tente novamente.<p class="small">'+esc(errMsg(e))+'</p></div>'}
 finally{btn.disabled=false;btn.textContent="Pesquisar materiais"}
}
async function saveLibraryItem(index,button){
 const item=librarySearchResults[index];if(!item)return;button.disabled=true;button.textContent="Salvando...";
 const {data,error}=await sb.from("study_library_items").upsert({user_id:user.id,title:item.title,source_url:item.source_url,source_name:item.source_name,content:item.content,summary:item.summary,language:"pt",updated_at:new Date().toISOString()},{onConflict:"user_id,source_url"}).select().single();
 if(error){button.disabled=false;button.textContent="Tentar novamente";return toast(errMsg(error))}
 if(!libraryItems.some(x=>x.id===data.id))libraryItems.unshift(data);button.textContent="Salvo";button.classList.remove("primary");button.classList.add("good");renderLibraries();toast("Material salvo na sua biblioteca!")
}
function makeLibraryCards(item){
 const lines=String(item.content||"").split(/\n+/).map(x=>x.trim()).filter(Boolean),sections=[];let heading=item.title,body=[];
 const flush=()=>{const text=body.join(" ").replace(/\s+/g," ").trim();if(text.length>90)sections.push({heading,body:text});body=[]};
 for(const line of lines){const h=line.match(/^={2,}\s*(.*?)\s*={2,}$/);if(h){flush();heading=h[1].trim()||item.title}else body.push(line)}flush();
 let out=sections.map(s=>({question:"Explique: "+s.heading,answer:(s.body.match(/[^.!?]+[.!?]?/g)||[s.body]).slice(0,2).join(" ").trim()})).filter(c=>c.answer.length>55);
 if(out.length<3){const ps=String(item.content||"").split(/\n\s*\n/).map(x=>x.trim()).filter(x=>x.length>100&&x.length<1200);for(const p of ps){if(out.length>=10)break;const answer=(p.match(/[^.!?]+[.!?]?/g)||[p]).slice(0,2).join(" ").trim();if(answer.length>65&&!out.some(c=>c.answer===answer))out.push({question:"O que é importante saber sobre "+item.title+"?",answer})}}
 return out.slice(0,12)
}
function openLibraryItem(id){
 const item=libraryItems.find(x=>x.id===id);if(!item)return;
 const body=String(item.content||"").split(/\n+/).map(line=>line.trim()).filter(Boolean).map(line=>/^={2,}/.test(line)?'<h3>'+esc(line.replace(/^=+|=+$/g,"").trim())+'</h3>':'<p>'+esc(line)+'</p>').join("");
 openModal(item.title,'<div class="library-reader"><p class="small muted">Fonte: <a href="'+esc(item.source_url)+'" target="_blank" rel="noopener">Abrir material original</a> · '+esc(item.source_name)+'</p><div>'+body+'</div></div><div class="actions" style="justify-content:flex-end;margin-top:16px"><button class="soft" id="readerClose">Fechar</button><button class="primary" id="readerGenerate">Gerar cartões deste material</button></div>');
 $("readerClose").onclick=closeModal;$("readerGenerate").onclick=()=>openLibraryCardGenerator(item)
}
function openLibraryCardGenerator(item){
 const suggestions=makeLibraryCards(item);if(!suggestions.length)return toast("Este material não tem texto suficiente para gerar cartões automaticamente.");
 const options=sets.map(s=>'<option value="'+s.id+'">'+esc(s.title)+'</option>').join("");
 openModal("Escolher cartões — "+item.title,'<p class="small muted">Marque somente as perguntas e respostas que deseja colocar no conjunto. Você pode conferir cada cartão antes de adicionar.</p><div class="field"><label>Adicionar ao conjunto</label><select id="libraryTargetSet">'+options+'</select></div><div class="actions" style="margin:12px 0;align-items:center"><label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="librarySelectAll" checked> Selecionar todos</label><span class="small muted" id="librarySelectedCount">'+suggestions.length+' selecionados</span></div><div id="libraryGeneratedCards">'+suggestions.map((c,i)=>'<label style="display:flex;gap:10px;align-items:flex-start;padding:12px 0;border-top:1px solid var(--line);cursor:pointer"><input type="checkbox" class="library-card-choice" data-library-card="'+i+'" checked style="margin-top:4px;flex:0 0 auto"><span style="min-width:0"><strong>'+esc(c.question)+'</strong><p class="small muted" style="margin:5px 0 0">'+esc(c.answer)+'</p></span></label>').join("")+'</div><div class="actions" style="margin-top:14px"><button class="soft" id="libraryCreateSet">Criar conjunto para este assunto</button><button class="primary" id="libraryAddSelected">Adicionar '+suggestions.length+' selecionados</button></div>');
 const choices=[...document.querySelectorAll(".library-card-choice")],selectAll=$("librarySelectAll"),count=$("librarySelectedCount"),add=$("libraryAddSelected");
 const refresh=()=>{const n=choices.filter(x=>x.checked).length;count.textContent=n+" selecionados";add.textContent="Adicionar "+n+" selecionados";add.disabled=n===0;selectAll.checked=n===choices.length;selectAll.indeterminate=n>0&&n<choices.length};
 choices.forEach(x=>x.addEventListener("change",refresh));
 selectAll.onchange=()=>{choices.forEach(x=>x.checked=selectAll.checked);refresh()};
 $("libraryCreateSet").onclick=async()=>{const {data,error}=await sb.from("study_sets").insert({user_id:user.id,title:item.title.slice(0,120),description:"Conjunto criado a partir da biblioteca: "+item.source_name}).select().single();if(error)return toast(errMsg(error));sets.unshift(data);$("libraryTargetSet").insertAdjacentHTML("beforeend",'<option value="'+data.id+'">'+esc(data.title)+'</option>');$("libraryTargetSet").value=data.id;toast("Conjunto criado. Agora escolha os cartões.")};
 add.onclick=async()=>{const id=$("libraryTargetSet").value;if(!id)return toast("Crie ou selecione um conjunto primeiro.");const selected=choices.filter(x=>x.checked).map(x=>suggestions[Number(x.dataset.libraryCard)]);if(!selected.length)return toast("Selecione pelo menos um cartão.");await saveLibraryCards(item,selected,id)};
}

async function saveLibraryCards(item,items,setId){
 const set=sets.find(s=>s.id===setId);if(!set)return toast("Selecione um conjunto válido.");
 const offset=setCards(setId).length,rows=items.map((c,i)=>({user_id:user.id,set_id:setId,question:c.question,answer:c.answer,position:offset+i,due_at:new Date().toISOString()}));
 const {error}=await sb.from("study_cards").insert(rows);if(error)return toast("Não consegui adicionar os cartões: "+errMsg(error));
 await loadData();closeModal();currentSet=sets.find(s=>s.id===setId);openSet(setId);toast(items.length+" cartão(ões) adicionado(s) ao conjunto "+set.title+".")
}

function studyNormalize(value){
 return String(value||"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLocaleLowerCase("pt-BR").replace(/[^a-z0-9]+/g," ").trim();
}
function studyTopicTerms(topic){
 const ignored=new Set(["sobre","para","com","uma","umas","uns","dos","das","que","por","the","and","principais","principal","conceitos","conceito","fundamentos","fundamento","introducao","basico","basicos","estudo","materiais","material"]);
 return studyNormalize(topic).split(/\\s+/).filter(w=>w.length>2&&!ignored.has(w));
}
function studyIsRelevant(item,topic){
 const terms=studyTopicTerms(topic),text=studyNormalize([item.title,item.content].join(" "));
 if(!terms.length)return false;
 const matched=terms.filter(term=>text.includes(term));
 if(matched.length<terms.length)return false;
 const normalizedTopic=studyNormalize(topic);
 if(normalizedTopic.includes("anatomia animal")&&/anatomia vegetal|botanica|plantas/.test(text))return false;
 if(/^java( |$)/.test(normalizedTopic)&&/indonesia|ilha de java|mar de java|povo javanes/.test(text)&&!/linguagem de programacao|programacao java|java virtual machine|jvm|jdk|javac/.test(text))return false;
 return true;
}
async function searchWebStudyMaterials(topic){
 const query=String(topic||"").trim();if(!query)return [];
 const normalized=studyNormalize(query);
 const specific=/\\bjava\\b/i.test(query)?query+" linguagem de programação":query;
 const queries=[
  'site:infoescola.com "'+specific+'"',
  'site:passeidireto.com "'+specific+'"',
  '"'+specific+'" material de estudo',
  '"'+specific+'" apostila universidade OR faculdade',
  '"'+specific+'" explicação conceitos'
 ];
 const found=[],seen=new Set();
 const add=(title,url,source,body)=>{
  const clean=String(body||"").replace(/\\r/g,"").trim(),link=String(url||"").trim();
  if(!clean||clean.length<180||!/^https?:\\/\\//i.test(link)||seen.has(link))return;
  let host=source||"";try{host=host||new URL(link).hostname.replace(/^www\\./,"")}catch(e){}
  const item={title:String(title||query).replace(/^#+\\s*/,"").slice(0,220),source_url:link,source_name:host,content:clean.slice(0,16000)};
  if(studyIsRelevant(item,query)){seen.add(link);found.push(item)}
 };
 const results=await Promise.allSettled(queries.map(async q=>{const r=await fetch("https://s.jina.ai/"+encodeURIComponent(q),{headers:{Accept:"text/plain"}});if(!r.ok)throw Error("Pesquisa indisponível");return r.text()}));
 for(const result of results){
  if(result.status!=="fulfilled")continue;
  for(const chunk of result.value.split(/(?=URL Source:\\s*https?:\\/\\/)/i)){
   const url=(chunk.match(/URL Source:\\s*(https?:\\/\\/[^\\s]+)/i)||[])[1];if(!url)continue;
   const title=(chunk.match(/Title:\\s*(.+)/i)||[])[1]||url;
   const body=chunk.replace(/^.*?Markdown Content:\\s*/is,"").trim();
   add(title,url,"",body);
  }
 }
 const preferred=found.filter(x=>/infoescola\\.com|passeidireto\\.com|\\.edu\\.br|universidade|uf[a-z]{2}\\.br|usp\\.br|scielo/i.test(x.source_url+" "+x.source_name));
 const candidates=[...preferred,...found.filter(x=>!preferred.includes(x))].slice(0,15);
 const pages=await Promise.allSettled(candidates.slice(0,12).map(async item=>{
  const r=await fetch("https://r.jina.ai/"+item.source_url,{headers:{Accept:"text/plain"}});
  if(!r.ok)throw Error("Leitura indisponível");
  return {...item,content:(await r.text()).slice(0,16000)};
 }));
 const merged=new Map();
 for(const x of pages)if(x.status==="fulfilled"&&studyIsRelevant(x.value,query))merged.set(x.value.source_url,x.value);
 for(const x of candidates)if(!merged.has(x.source_url)&&studyIsRelevant(x,query))merged.set(x.source_url,x);
 // A Wikipédia foi retirada porque seus resultados ambíguos estavam desviando assuntos específicos.
 return [...merged.values()].slice(0,12);
}
function createCardsFromResearch(materials,topic){
 const out=[],seen=new Set(),skip=/^(menu|início|inicio|home|login|cadastre-se|entrar|compartilhar|referências|referencias|bibliografia|leia também|veja também)$/i;
 for(const item of materials||[]){
  if(!studyIsRelevant(item,topic))continue;
  const lines=String(item.content||"").split(/\n+/).map(x=>x.replace(/^\s*#+\s*/,"").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/[*_>|]/g,"").trim()).filter(Boolean);
  let heading=item.title||topic,paragraphs=[];
  for(const line of lines){if(line.length<100&&!/[.!?]$/.test(line)&&!skip.test(line)){heading=line.slice(0,120);continue}if(line.length>=100&&line.length<=1800&&!skip.test(line))paragraphs.push({heading,text:line})}
  if(!paragraphs.length){const plain=String(item.content||"").replace(/https?:\/\/\S+/g," ").replace(/[#*_>|]/g," ");paragraphs=plain.split(/\n\s*\n/).filter(x=>x.trim().length>130).slice(0,8).map((text,i)=>({heading:(item.title||topic)+" — trecho "+(i+1),text:text.trim()}))}
  for(const p of paragraphs){if(!studyIsRelevant({title:p.heading,content:p.text},topic))continue;const sentences=(p.text.match(/[^.!?]+[.!?]?/g)||[p.text]).map(x=>x.trim()).filter(x=>x.length>20),answer=sentences.slice(0,3).join(" ").slice(0,850);if(answer.length<75)continue;const section=(p.heading||item.title||topic).replace(/\s+/g," ").trim().slice(0,110);let question="O que o material explica sobre "+section+"?";if(seen.has(question.toLowerCase()))question="Quais pontos importantes sobre "+topic+" aparecem neste trecho?";const key=answer.toLowerCase().slice(0,100);if(seen.has(key))continue;seen.add(key);seen.add(question.toLowerCase());out.push({question,answer,source:item.source_name,source_url:item.source_url});if(out.length>=30)return out}
 }
 return out;
}
function openCardModal(id=null){
 const old=id?cards.find(c=>c.id===id):null;let suggestions=[];
 openModal(old?"Editar cartão":"Novo cartão",'<form id="cardForm"><div class="field"><label>Frente — pergunta ou termo</label><textarea name="question" required>'+esc(old?.question||"")+'</textarea></div><div class="field" style="margin-top:12px"><label>Verso — resposta ou definição</label><textarea name="answer" required>'+esc(old?.answer||"")+'</textarea></div><div id="cardSuggestions" class="panel" style="padding:14px;margin-top:18px"><strong>Pesquisar cartões sobre '+esc(currentSet?.title||"este conjunto")+'</strong><p class="small muted">Pesquise na internet. As perguntas e respostas serão elaboradas a partir dos textos públicos encontrados, com indicação da fonte.</p><div class="actions" style="margin:10px 0"><button type="button" class="primary" id="searchWebCardSuggestions">Pesquisar na internet</button></div><div id="cardSuggestionStatus" class="small muted"></div><div id="cardSuggestionList"></div></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="soft" id="cancelModal">Cancelar</button><button class="primary">Salvar cartão</button></div></form>');
 const panel=$("cardSuggestions"),list=$("cardSuggestionList"),searchButton=$("searchWebCardSuggestions"),status=$("cardSuggestionStatus");if(old)panel.classList.add("hidden");
 const render=()=>{list.innerHTML=suggestions.map((x,i)=>'<div style="padding:11px 0;border-top:1px solid var(--line)"><strong class="small">'+esc(x.question)+'</strong><p class="small muted" style="margin:4px 0">'+esc(x.answer)+'</p><p class="small muted">Fonte: '+esc(x.source||"Material público")+' · <a href="'+esc(x.source_url||"#")+'" target="_blank" rel="noopener">consultar original</a></p><button type="button" class="soft" data-card-suggestion="'+i+'">Adicionar cartão</button></div>').join("")||'<p class="small muted">Clique em “Pesquisar na internet” para buscar materiais e criar sugestões para este assunto.</p>';
 list.querySelectorAll("[data-card-suggestion]").forEach(btn=>btn.onclick=async()=>{const index=Number(btn.dataset.cardSuggestion),x=suggestions[index];btn.disabled=true;btn.textContent="Adicionando...";const {error}=await sb.from("study_cards").insert({user_id:user.id,set_id:currentSet.id,question:x.question,answer:x.answer,position:setCards(currentSet.id).length,due_at:new Date().toISOString()});if(error){btn.disabled=false;btn.textContent="Adicionar cartão";return toast(errMsg(error))}suggestions.splice(index,1);await loadData();openSet(currentSet.id);openCardModal();toast("Cartão adicionado!")});
 if(suggestions.length){list.insertAdjacentHTML("beforeend",'<div style="padding-top:12px"><button type="button" class="primary" id="addAllCardSuggestions">Adicionar todas ('+suggestions.length+')</button></div>');$("addAllCardSuggestions").onclick=async()=>{const target=currentSet.id,offset=setCards(target).length,rows=suggestions.map((x,i)=>({user_id:user.id,set_id:target,question:x.question,answer:x.answer,position:offset+i,due_at:new Date().toISOString()}));const {error}=await sb.from("study_cards").insert(rows);if(error)return toast(errMsg(error));const n=suggestions.length;closeModal();await loadData();openSet(target);toast(n+" cartões adicionados!")}}
 };
 render();
 searchButton.onclick=async()=>{searchButton.disabled=true;searchButton.textContent="Pesquisando...";status.textContent="Consultando fontes públicas da internet. Isso pode levar alguns segundos...";try{const topic=(currentSet?.title||"")+" "+(currentSet?.description||""),materials=await searchWebStudyMaterials(topic.trim()),generated=createCardsFromResearch(materials,currentSet?.title||topic),known=new Set(suggestions.map(x=>x.question.toLowerCase()+"|"+x.answer.toLowerCase())),fresh=generated.filter(x=>!known.has(x.question.toLowerCase()+"|"+x.answer.toLowerCase()));suggestions.push(...fresh);render();status.textContent=materials.length+" fontes/textos consultados · "+fresh.length+" novas sugestões. A quantidade depende do conteúdo público encontrado.";if(!fresh.length)toast("Não encontrei texto público suficiente para novos cartões. Tente pesquisar novamente mais tarde.")}catch(error){status.textContent="Não foi possível concluir a pesquisa. Tente novamente.";toast("Erro na pesquisa: "+errMsg(error))}finally{searchButton.disabled=false;searchButton.textContent="Pesquisar mais sugestões na internet"}};
 $("cancelModal").onclick=closeModal;
 $("cardForm").onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));let result;if(old)result=await sb.from("study_cards").update({question:d.question.trim(),answer:d.answer.trim()}).eq("id",id);else result=await sb.from("study_cards").insert({user_id:user.id,set_id:currentSet.id,question:d.question.trim(),answer:d.answer.trim(),position:setCards(currentSet.id).length}).select().single();if(result.error)return toast(errMsg(result.error));closeModal();await loadData();openSet(currentSet.id);toast("Cartão salvo!")};
}
async function deleteCard(id){if(!confirm("Excluir este cartão?"))return;const {error}=await sb.from("study_cards").delete().eq("id",id);if(error)return toast(errMsg(error));await loadData();openSet(currentSet.id);toast("Cartão excluído")}
async function deleteSet(){if(!currentSet)return;const target=currentSet;if(!confirm('Excluir o conjunto "'+target.title+'"? Todos os cartões dele também serão excluídos permanentemente. Essa ação não pode ser desfeita.'))return;const {data,error}=await sb.from("study_sets").delete().eq("id",target.id).eq("user_id",user.id).select("id");if(error)return toast("Não foi possível excluir o conjunto: "+errMsg(error));if(!data?.length)return toast("O conjunto não foi excluído. Atualize a página e tente novamente.");currentSet=null;await loadData();if(target.folder_id&&folders.some(f=>f.id===target.folder_id))openFolder(target.folder_id);else showPage("home");toast('Conjunto "'+target.title+'" excluído.')}
async function toggleFavorite(id){const c=cards.find(x=>x.id===id);const {error}=await sb.from("study_cards").update({is_favorite:!c.is_favorite}).eq("id",id);if(error)return toast(errMsg(error));await loadData();if(page==="detail")renderCards();if(page==="favorites")renderFavorites()}
function buildSuggestions(topic){
 const clean=String(topic||"").trim();
 if(!clean)return [];
 const t=clean.toLocaleLowerCase("pt-BR");
 const groups=[
  {keys:["javascript","js"],items:["Fundamentos e sintaxe","Variáveis, tipos e operadores","Condições e estruturas de repetição","Funções, arrays e objetos","DOM e eventos","Assincronismo e APIs"]},
  {keys:["programação","logica","lógica","algoritmo"],items:["Lógica e algoritmos","Variáveis e tipos de dados","Operadores e condições","Laços de repetição","Funções e modularização","Vetores e matrizes"]},
  {keys:["inglês","ingles","english"],items:["Vocabulário do dia a dia","Verbos e tempos verbais","Frases e conversação","Gramática essencial","Leitura e interpretação","Pronúncia e listening"]},
  {keys:["português","portugues","gramática","gramatica"],items:["Classes gramaticais","Ortografia e acentuação","Pontuação","Concordância verbal e nominal","Interpretação de texto","Sintaxe e análise de frases"]},
  {keys:["matemática","matematica"],items:["Operações fundamentais","Frações e números decimais","Porcentagem e regra de três","Equações","Geometria","Estatística e probabilidade"]},
  {keys:["engenharia de software","software"],items:["Requisitos de software","Modelagem e UML","Arquitetura e padrões","Banco de dados","Testes de software","Qualidade e manutenção"]},
  {keys:["história","historia"],items:["Contexto histórico","Períodos e acontecimentos","Personagens importantes","Causas e consequências","Datas e conceitos-chave","Revisão e questões"]},
  {keys:["geografia"],items:["Conceitos fundamentais","Geografia física","Geografia humana","Cartografia","Brasil: regiões e características","Clima e meio ambiente"]},
  {keys:["biologia","ciências","ciencias"],items:["Conceitos fundamentais","Células e genética","Corpo humano","Ecologia e meio ambiente","Evolução e diversidade","Processos biológicos"]},
  {keys:["direito"],items:["Conceitos e princípios","Legislação essencial","Direitos e deveres","Instituições e competências","Casos práticos","Questões de revisão"]},
  {keys:["administração","administracao"],items:["Fundamentos da área","Principais teorias","Processos e ferramentas","Planejamento e estratégia","Indicadores e resultados","Estudos de caso"]}
 ];
 const found=groups.find(g=>g.keys.some(k=>t.includes(k)));
 const items=found?found.items:["Fundamentos de "+clean,"Conceitos principais de "+clean,"Termos e definições de "+clean,"Aplicações práticas de "+clean,"Exemplos e exercícios de "+clean,"Revisão geral de "+clean];
 return items.map((item,i)=>{const title=found?clean+" — "+item:item;return {title,description:"Conjunto de estudo sobre "+title.toLocaleLowerCase("pt-BR")+".",position:i};});
}
function renderSuggestionButtons(topic,containerId,mode){
 const box=$(containerId);if(!box)return;
 const suggestions=buildSuggestions(topic);
 box.innerHTML=suggestions.length?'<div class="small muted" style="margin:8px 0">Sugestões para "'+esc(topic)+'" — escolha as que quiser adicionar:</div><div class="grid">'+suggestions.map((s,i)=>'<article class="theme-card"><strong>'+esc(s.title)+'</strong><div class="small muted" style="margin-top:5px">'+esc(s.description)+'</div><div class="set-meta"><span></span><button type="button" class="soft" data-suggestion="'+i+'">Adicionar</button></div></article>').join("")+'</div>':'';
 box.querySelectorAll("[data-suggestion]").forEach(b=>b.onclick=async()=>{
  const item=suggestions[Number(b.dataset.suggestion)];
  if(mode==="folder"){
   const folderId=$("folderSuggestionTarget")?.value;
   if(!folderId)return toast("Crie ou selecione uma pasta primeiro.");
   await createSuggestedSet(folderId,item);
  }else{
   const titleField=$("setForm")?.elements.namedItem("title");
   const descField=$("setForm")?.elements.namedItem("description");
   if(titleField)titleField.value=item.title;
   if(descField)descField.value=item.description;
  }
 });
}
async function createSuggestedSet(folderId,item){
 const {data,error}=await sb.from("study_sets").insert({user_id:user.id,title:item.title,description:item.description,folder_id:folderId}).select().single();
 if(error)return toast(errMsg(error));
 sets.unshift(data);renderDashboard();if(page==="folders")renderFolders();
 toast('Conjunto "'+item.title+'" adicionado à pasta!');
}
function openFolderModal(){
 openModal("Criar pasta",'<form id="folderForm"><div class="field"><label>Qual assunto você quer estudar?</label><input name="name" required maxlength="100" placeholder="Ex.: JavaScript, Excel, Direito..."></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="soft" id="cancelModal">Cancelar</button><button class="primary">Criar pasta</button></div></form>');
 const input=$("folderForm").elements.namedItem("name");
 $("cancelModal").onclick=closeModal;
 $("folderForm").onsubmit=async e=>{
  e.preventDefault();const name=input.value.trim();if(!name)return;
  const {data,error}=await sb.from("study_folders").insert({user_id:user.id,name}).select().single();
  if(error)return toast(errMsg(error));
   folders.push(data);closeModal();renderDashboard();renderFolders();showPage("folders");
   toast("Pasta criada!");
 };
}
function renderReview(){const dueList=cards.filter(due),weak=cards.filter(c=>attempts(c)>0&&accuracy(c)<70),strong=cards.filter(c=>Number(c.mastery_level||0)>=3),fresh=cards.filter(c=>attempts(c)===0);$("reviewDueCount").textContent=dueList.length;$("reviewWeakCount").textContent=weak.length;$("reviewStrongCount").textContent=strong.length;$("reviewNewCount").textContent=fresh.length;$("startDuePage").disabled=!dueList.length;$("startWeak").disabled=!weak.length;$("startAll").disabled=!cards.length;$("reviewList").innerHTML=dueList.length?dueList.slice(0,30).map(c=>'<div class="card-row"><p><strong>'+esc(c.question)+'</strong><div class="small muted">'+esc(sets.find(s=>s.id===c.set_id)?.title||"Conjunto")+'</div></p><span class="pill">'+(attempts(c)?accuracy(c)+'% acerto':'Ainda não praticado')+'</span><button class="soft" data-review-set="'+c.set_id+'">Abrir conjunto</button></div>').join(""):'<div class="empty">Sua fila está vazia. Muito bem! Você pode praticar todos os cartões ou continuar estudando.</div>';document.querySelectorAll("[data-review-set]").forEach(b=>b.onclick=()=>openSet(b.dataset.reviewSet))}
function renderInsights(){const a=cards.reduce((n,c)=>n+attempts(c),0),ok=cards.reduce((n,c)=>n+Number(c.correct_count||0),0),bad=cards.reduce((n,c)=>n+Number(c.wrong_count||0),0);$("insAttempts").textContent=a;$("insCorrect").textContent=ok;$("insWrong").textContent=bad;$("insAccuracy").textContent=a?Math.round(ok/a*100)+"%":"—";$("setPerformance").innerHTML=sets.length?sets.map(s=>{const cs=setCards(s.id),n=cs.reduce((v,c)=>v+attempts(c),0),right=cs.reduce((v,c)=>v+Number(c.correct_count||0),0),pct=n?Math.round(right/n*100):0;return '<div style="padding:12px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:10px"><strong>'+esc(s.title)+'</strong><span class="small muted">'+(n?pct+"% de acerto":"Ainda sem dados")+'</span></div><div class="set-progress"><div class="barline"><span style="width:'+pct+'%"></span></div><span class="small muted">'+cs.length+' cartões</span></div></div>'}).join(""):'<div class="empty">Crie seu primeiro conjunto para ver seu desempenho.</div>';const weak=cards.filter(c=>attempts(c)>0&&accuracy(c)<70).sort((a,b)=>(accuracy(a)||0)-(accuracy(b)||0));$("weakCards").innerHTML=weak.length?weak.slice(0,12).map(c=>'<div class="card-row"><p><strong>'+esc(c.question)+'</strong><div class="small muted">'+esc(sets.find(s=>s.id===c.set_id)?.title||"Conjunto")+'</div></p><span class="pill">'+accuracy(c)+'% de acerto</span><button class="soft" data-weakset="'+c.set_id+'">Treinar</button></div>').join(""):'<div class="empty">Ainda não há dificuldades identificadas. Responda alguns cartões para o Estuda encontrar onde reforçar.</div>';document.querySelectorAll("[data-weakset]").forEach(b=>b.onclick=()=>startStudy("weak",b.dataset.weakset))}
function openFolder(id){currentFolder=folders.find(f=>f.id===id);if(!currentFolder)return;showPage("folderDetail")}
function renderFolderDetail(){if(!currentFolder)return;const list=sets.filter(s=>s.folder_id===currentFolder.id);$("folderDetailTitle").textContent=currentFolder.name;$("folderDetailDesc").textContent=list.length+" conjuntos nesta pasta";$("folderSetsGrid").innerHTML=list.length?list.map(s=>{const cs=setCards(s.id),d=cs.filter(due).length;return '<article class="set-card" data-folder-card="'+s.id+'"><span class="tag">Conjunto</span><h3>'+esc(s.title)+'</h3><div class="muted small">'+esc(s.description||"Sem descrição")+'</div><div class="set-meta"><span>'+cs.length+' cartões · '+d+' para revisar</span></div><div class="actions" style="margin-top:12px"><button type="button" class="primary" data-folder-access="'+s.id+'">Acessar / editar</button><button type="button" class="danger" data-folder-delete="'+s.id+'">Excluir</button></div></article>'}).join(""):'<div class="empty"><h3>Esta pasta está vazia</h3><p>Crie um conjunto para começar a organizar seus estudos aqui.</p><button class="primary" id="emptyFolderSet">＋ Criar conjunto</button></div>';document.querySelectorAll("[data-folder-card]").forEach(el=>el.onclick=e=>{if(e.target.closest("button"))return;openSet(el.dataset.folderCard)});document.querySelectorAll("[data-folder-access]").forEach(b=>b.onclick=()=>openSet(b.dataset.folderAccess));document.querySelectorAll("[data-folder-delete]").forEach(b=>b.onclick=async()=>{const s=sets.find(x=>x.id===b.dataset.folderDelete);if(!s)return;if(!confirm('Excluir o conjunto "'+s.title+'"? Todos os cartões dele também serão excluídos permanentemente.'))return;const {data,error}=await sb.from("study_sets").delete().eq("id",s.id).eq("user_id",user.id).select("id");if(error)return toast("Não foi possível excluir: "+errMsg(error));if(!data?.length)return toast("O conjunto não foi excluído. Atualize a página e tente novamente.");await loadData();renderFolderDetail();toast('Conjunto "'+s.title+'" excluído.')});const emptyBtn=$("emptyFolderSet");if(emptyBtn)emptyBtn.onclick=()=>openSetModal(currentFolder.id)}
function renderFolders(){$("foldersList").innerHTML=folders.length?folders.map(f=>'<article class="set-card" data-folder-card-open="'+f.id+'"><h3>▣ '+esc(f.name)+'</h3><div class="muted small">'+sets.filter(s=>s.folder_id===f.id).length+' conjuntos</div><div class="set-meta"><span>Clique para ver os conjuntos</span><button type="button" class="soft" data-openfolder="'+f.id+'">Abrir pasta →</button><button type="button" class="danger" data-delfolder="'+f.id+'">Excluir pasta</button></div></article>').join(""):'<div class="empty">Você ainda não criou pastas.</div>';document.querySelectorAll("[data-folder-card-open]").forEach(el=>el.onclick=e=>{if(e.target.closest("button"))return;openFolder(el.dataset.folderCardOpen)});document.querySelectorAll("[data-openfolder]").forEach(b=>b.onclick=()=>openFolder(b.dataset.openfolder));document.querySelectorAll("[data-delfolder]").forEach(b=>b.onclick=async()=>{if(!confirm("Excluir a pasta? Os conjuntos serão mantidos sem pasta."))return;const {error}=await sb.from("study_folders").delete().eq("id",b.dataset.delfolder);if(error)return toast(errMsg(error));if(currentFolder?.id===b.dataset.delfolder)currentFolder=null;await loadData();renderFolders()})}
function renderFavorites(){const fav=cards.filter(c=>c.is_favorite);$("favoritesList").innerHTML=fav.length?fav.map(c=>'<article class="set-card"><span class="tag">★ Favorito</span><h3>'+esc(c.question)+'</h3><p class="muted small">'+esc(c.answer)+'</p><div class="set-meta"><span>'+esc(sets.find(s=>s.id===c.set_id)?.title||"Conjunto")+'</span><button class="plain" data-unfav="'+c.id+'">Remover ★</button></div></article>').join(""):'<div class="empty">Nenhum favorito ainda. Marque cartões com a estrela para encontrá-los aqui.</div>';document.querySelectorAll("[data-unfav]").forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.unfav))}
function startStudy(mode="all",setId=null){let list=setId?setCards(setId):cards;if(mode==="due")list=list.filter(due);if(mode==="weak")list=list.filter(c=>attempts(c)>0&&accuracy(c)<70);if(!list.length)return toast("Não há cartões nesta fila. Experimente estudar todos.");studyCards=mode==="due"?list.sort((a,b)=>(new Date(a.due_at||0))-(new Date(b.due_at||0))):shuffle(list);studyIndex=0;flipped=false;quizMode=false;quizAnswered=false;sessionCorrect=0;sessionWrong=0;retryAdded=new Set();answeredInSession=new Set();previousIndex=-1;currentSet=setId?sets.find(s=>s.id===setId):null;$("studyTitle").textContent=mode==="due"?"Revisão inteligente":mode==="weak"?"Treino de dificuldades":currentSet?.title||"Prática geral";$("studyModeLabel").textContent=mode==="due"?"REVISÃO":mode==="weak"?"REFORÇO":"PRÁTICA";showPage("study");renderStudy()}
function renderStudy(){if(studyIndex>=studyCards.length)return finishStudy();const c=studyCards[studyIndex];$("studyCounter").textContent=(studyIndex+1)+" de "+studyCards.length+" cartões nesta sessão";$("studyProgress").style.width=(studyIndex/studyCards.length*100)+"%";$("prevCard").disabled=studyIndex===0;$("nextCard").classList.toggle("hidden",!quizMode);$("nextCard").textContent=studyIndex===studyCards.length-1?"Finalizar":"Próximo →";if(quizMode){const options=shuffle([...new Set([c.answer,...shuffle(cards.filter(x=>x.id!==c.id).map(x=>x.answer)).slice(0,3)])]);$("studyStage").innerHTML='<div class="panel"><div class="muted small">QUAL É A RESPOSTA CORRETA?</div><h2 style="white-space:pre-wrap">'+esc(c.question)+'</h2><div id="quizOptions">'+options.map(o=>'<button class="quiz-option" data-answer="'+encodeURIComponent(o)+'">'+esc(o)+'</button>').join("")+'</div><p id="quizFeedback" class="muted"></p></div>';$("studyHint").textContent="Escolha uma resposta para registrar seu resultado.";document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>answerQuiz(b,c))}else{$("studyStage").innerHTML='<div class="study-card" id="flipCard"><div class="muted">'+(flipped?"RESPOSTA":"PERGUNTA")+'</div><h2>'+esc(flipped?c.answer:c.question)+'</h2><div class="muted">'+(flipped?"Como você se saiu?":"Toque para revelar a resposta")+'</div></div>';$("flipCard").onclick=()=>{if(!flipped){flipped=true;renderStudy()}};$("studyHint").textContent=flipped?"Avalie com sinceridade para ajustar sua próxima revisão.":"Tente responder antes de revelar.";$("nextCard").classList.add("hidden");if(flipped){$("studyStage").insertAdjacentHTML("beforeend",'<div class="rating-row"><button class="danger" data-grade="again">Errei<br><span class="small">Repetir no fim</span></button><button class="warn" data-grade="hard">Difícil<br><span class="small">1 dia</span></button><button class="good" data-grade="good">Acertei<br><span class="small">3 dias</span></button><button class="primary" data-grade="easy">Fácil<br><span class="small">7 dias</span></button></div>');document.querySelectorAll("[data-grade]").forEach(b=>b.onclick=()=>rateCard(c,b.dataset.grade))}}}
async function persistReview(c,grade){const ok=grade!=="again",oldInterval=Number(c.interval_days||0),streak=ok?Number(c.streak||0)+1:0;let interval=grade==="again"?0:grade==="hard"?Math.max(1,Math.round(oldInterval*1.2)||1):grade==="good"?Math.max(3,Math.round(oldInterval*2)||3):Math.max(7,Math.round(oldInterval*2.8)||7);const dueAt=new Date(Date.now()+(grade==="again"?15*60*1000:interval*86400000)).toISOString();const updates={attempts:attempts(c)+1,correct_count:Number(c.correct_count||0)+(ok?1:0),wrong_count:Number(c.wrong_count||0)+(ok?0:1),streak,interval_days:interval,due_at:dueAt,last_reviewed_at:new Date().toISOString(),mastery_level:ok?Math.min(5,Number(c.mastery_level||0)+(grade==="easy"?2:1)):0};const {error}=await sb.from("study_cards").update(updates).eq("id",c.id);if(error){toast("Não consegui salvar seu resultado: "+errMsg(error));return false}Object.assign(c,updates);return true}
async function rateCard(c,grade){const ok=grade!=="again";if(!await persistReview(c,grade))return;if(!answeredInSession.has(c.id)){answeredInSession.add(c.id);if(ok)sessionCorrect++;else sessionWrong++}if(!ok&&!retryAdded.has(c.id)){retryAdded.add(c.id);studyCards.push(c)}studyIndex++;flipped=false;renderStudy()}
async function answerQuiz(button,c){if(quizAnswered)return;quizAnswered=true;const ok=decodeURIComponent(button.dataset.answer)===c.answer;const grade=ok?"good":"again";if(!await persistReview(c,grade))return;if(!answeredInSession.has(c.id)){answeredInSession.add(c.id);if(ok)sessionCorrect++;else sessionWrong++}if(!ok&&!retryAdded.has(c.id)){retryAdded.add(c.id);studyCards.push(c)}button.classList.add(ok?"correct":"wrong");document.querySelectorAll("[data-answer]").forEach(b=>{b.disabled=true;if(decodeURIComponent(b.dataset.answer)===c.answer)b.classList.add("correct")});$("quizFeedback").textContent=ok?"Correto! Boa memória.":"Quase! A resposta correta é: "+c.answer;$("nextCard").classList.remove("hidden");$("studyHint").textContent=ok?"Resposta registrada.":"Este cartão voltará ao final da fila para você tentar novamente."}
function finishStudy(){$("studyProgress").style.width="100%";$("studyStage").innerHTML='<div class="panel" style="text-align:center;padding:35px 20px"><div style="font-size:42px">🎉</div><h2>Sessão concluída!</h2><p class="muted">Você praticou '+(sessionCorrect+sessionWrong)+' respostas nesta sessão.</p><div class="stat-grid"><div class="stat-card"><div class="stat-number">'+sessionCorrect+'</div><div class="stat-label">Acertos</div></div><div class="stat-card"><div class="stat-number">'+sessionWrong+'</div><div class="stat-label">Erros</div></div><div class="stat-card"><div class="stat-number">'+(sessionCorrect+sessionWrong?Math.round(sessionCorrect/(sessionCorrect+sessionWrong)*100):0)+'%</div><div class="stat-label">Precisão</div></div><div class="stat-card"><div class="stat-number">'+studyCards.length+'</div><div class="stat-label">Cartões na fila</div></div></div><p class="muted small">Os cartões que você errou foram colocados novamente no final da sessão. As próximas revisões foram ajustadas.</p><button class="primary" id="finishBack">Voltar ao painel</button></div>';$("studyCounter").textContent="Sessão finalizada";$("prevCard").classList.add("hidden");$("nextCard").classList.add("hidden");$("studyHint").textContent="";$("finishBack").onclick=async()=>{await loadData();$("prevCard").classList.remove("hidden");$("nextCard").classList.remove("hidden");showPage("home")}}
$("authSwitch").onclick=e=>{e.preventDefault();authMode=authMode==="login"?"signup":"login";$("authTitle").textContent=authMode==="login"?"Entre na sua conta":"Crie sua conta";$("authDesc").textContent=authMode==="login"?"Use a mesma conta do ControlePeso.":"Cadastre-se para acessar seus estudos em qualquer dispositivo.";$("authSubmit").textContent=authMode==="login"?"Entrar":"Criar conta";$("authSwitchText").textContent=authMode==="login"?"Ainda não tem conta?":"Já tem uma conta?";$("authSwitch").textContent=authMode==="login"?"Criar conta":"Entrar";$("authError").textContent=""};
$("authForm").onsubmit=async e=>{e.preventDefault();const email=$("email").value.trim(),password=$("password").value;$("authSubmit").disabled=true;let r=authMode==="login"?await sb.auth.signInWithPassword({email,password}):await sb.auth.signUp({email,password});$("authSubmit").disabled=false;if(r.error){$("authError").textContent=errMsg(r.error);return}if(authMode==="signup"&&!r.data.session){$("authError").textContent="Cadastro realizado. Confirme seu e-mail e depois entre. Se você já usa o ControlePeso, entre com seu cadastro existente.";return}await enterApp(r.data.user)};
async function enterApp(u){user=u;$("authScreen").classList.add("hidden");$("app").classList.remove("hidden");$("userEmail").textContent=u.email||"";try{await loadData()}catch(e){toast("Erro ao carregar: "+errMsg(e))}}
$("logout").onclick=async()=>{await sb.auth.signOut();user=null;$("app").classList.add("hidden");$("authScreen").classList.remove("hidden")};
async function resetCardsProgress(query,successMessage){
 const {error}=await query;
 if(error){toast(errMsg(error));return false}
 await loadData();
 if(page==="detail"&&currentSet)openSet(currentSet.id);
 if(page==="insights")renderInsights();
 toast(successMessage);
 return true;
}
$("resetProgress").onclick=async()=>{
 if(!confirm("Apagar todo o seu progresso? Seus conjuntos, pastas e cartões serão mantidos, mas acertos, erros, tentativas e revisões serão zerados. Os cartões ficarão disponíveis para estudar novamente."))return;
 await resetCardsProgress(sb.from("study_cards").update({attempts:0,correct_count:0,wrong_count:0,streak:0,interval_days:0,due_at:new Date().toISOString(),last_reviewed_at:null,mastery_level:0}).eq("user_id",user.id),"Todo o progresso foi zerado. Seus conteúdos foram mantidos.");
};
$("deleteSet").onclick=deleteSet;
$("resetSetProgress").onclick=async()=>{
 if(!currentSet)return;
 if(!confirm('Zerar o progresso de "'+currentSet.title+'"? Apenas as estatísticas e revisões deste conjunto serão apagadas. Os cartões e os demais conjuntos serão mantidos.'))return;
 await resetCardsProgress(sb.from("study_cards").update({attempts:0,correct_count:0,wrong_count:0,streak:0,interval_days:0,due_at:new Date().toISOString(),last_reviewed_at:null,mastery_level:0}).eq("user_id",user.id).eq("set_id",currentSet.id),'Progresso de "'+currentSet.title+'" zerado.');
};
$("newSet").onclick=$("newSetSide").onclick=openSetModal;$("addCard").onclick=()=>openCardModal();$("editSet").onclick=()=>{const s=currentSet;openModal("Editar conjunto",'<form id="editSetForm"><div class="field"><label>Nome</label><input name="title" required value="'+esc(s.title)+'"></div><div class="field" style="margin-top:12px"><label>Descrição</label><textarea name="description">'+esc(s.description||"")+'</textarea></div><div class="field" style="margin-top:12px"><label>Pasta</label><select name="folder_id"><option value="">Sem pasta</option>'+folders.map(f=>'<option value="'+f.id+'" '+(f.id===s.folder_id?"selected":"")+'>'+esc(f.name)+'</option>').join("")+'</select></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="soft" id="cancelModal">Cancelar</button><button class="primary">Salvar</button></div></form>');$("cancelModal").onclick=closeModal;$("editSetForm").onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const {error}=await sb.from("study_sets").update({title:d.title,description:d.description,folder_id:d.folder_id||null,updated_at:new Date().toISOString()}).eq("id",s.id);if(error)return toast(errMsg(error));closeModal();await loadData();openSet(s.id)}};
$("startFlash").onclick=()=>startStudy("all",currentSet.id);$("startQuiz").onclick=()=>{startStudy("all",currentSet.id);quizMode=true;$("studyModeLabel").textContent="TESTE";renderStudy()};$("startSetDue").onclick=()=>startStudy("due",currentSet.id);$("startDueHome").onclick=()=>startStudy("due");$("startDuePage").onclick=()=>startStudy("due");$("startWeak").onclick=()=>startStudy("weak");$("startAll").onclick=()=>startStudy("all");$("backHome").onclick=()=>currentSet?.folder_id&&folders.some(f=>f.id===currentSet.folder_id)?openFolder(currentSet.folder_id):showPage("home");$("exitStudy").onclick=async()=>{await loadData();$("prevCard").classList.remove("hidden");$("nextCard").classList.remove("hidden");showPage(currentSet?"detail":"home");if(currentSet)openSet(currentSet.id)};$("prevCard").onclick=()=>{if(studyIndex>0){studyIndex--;flipped=false;quizAnswered=false;renderStudy()}};$("nextCard").onclick=()=>{if(studyIndex<studyCards.length-1){studyIndex++;flipped=false;quizAnswered=false;renderStudy()}else{studyIndex=studyCards.length;finishStudy()}};$("search").oninput=e=>renderSets(sets.filter(s=>(s.title+" "+s.description).toLowerCase().includes(e.target.value.toLowerCase())));
document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>showPage(b.dataset.page));document.querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>showPage(b.dataset.goto));
$("createFolder").onclick=openFolderModal;$("backFolders").onclick=()=>showPage("folders");$("librarySearchForm").onsubmit=e=>{e.preventDefault();searchLibrary()};$("libraryQuery").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();searchLibrary()}});$("newSetInFolder").onclick=()=>currentFolder&&openSetModal(currentFolder.id);
$("closeModal").onclick=closeModal;$("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};
sb.auth.getSession().then(({data})=>{if(data.session)enterApp(data.session.user)});sb.auth.onAuthStateChange((_event,session)=>{if(session?.user&&!user)enterApp(session.user)});
