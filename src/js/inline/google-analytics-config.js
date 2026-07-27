
setTimeout(configureGoogleAnalytics, 4000);

function configureGoogleAnalytics() {
  const googleScriptSource = document.getElementById('analytics');

  // googleScriptSource.onload = () => {
    if (googleScriptSource) {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-L213SBPLTW');
    };  
};
