document.getElementById('saveBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getVideoInfo,
  }, async (results) => {
    const videoInfo = results[0].result;
    if (!videoInfo) {
      document.getElementById('status').innerText = 'Não é uma página de vídeo do YouTube!';
      return;
    }
    // Envia para a API
    const response = await fetch('http://localhost:3001/cadastrar_video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoInfo)
    });
    if (response.ok) {
      document.getElementById('status').innerText = 'Enviado com sucesso!';
      console.log(videoInfo)
    } else {
      document.getElementById('status').innerText = 'Erro ao enviar!';
      
    }
  });
});

function getVideoInfo() {
  if (!location.href.includes('youtube.com/watch')) return null;
  const h1 = document.querySelector('h1.style-scope.ytd-watch-metadata');
  const title = h1 ? h1.innerText : '';
  console.log(title);
  const url = location.href;
  const minute = 1;
  const category = { type: "Teste" };
  return { title, url, minute, category };
} 