$().on('load', async e => {
  console.log(aim.config);
  if (aim.config.whitelist.includes(aim.config.client.ip)) {
    function list(selector, options){
      const args = Array.from(arguments);
      const url = args.shift();
      document.location.hash = `#?l=${aim.urlToId($().url('https://aliconnect.nl/api/'+selector).query(options).toString())}`;
    }
    aim.om.treeview({
      CRM: {
        Contactpersoon: e => list('Contactpersoon'),
        Organisatie: e => list('Organisatie'),
        Functie: e => list('Functie'),
        Medewerker: e => list('Medewerker'),
      },
      Taken: {
        Project: e => list('Project'),
        Agenda: e => list('Agenda'),
        Activiteit: e => list('Activiteit'),
        Campagne: e => list('Campagne'),
        Fase: e => list('Fase'),
        Leveringen: e => list('Leveringen'),
        Notities: e => list('Notities'),
        Document: e => list('Document'),
        UrenRegistratie: e => list('UrenRegistratie'),
      },
    });
  }
  // console.log(111, aim.config);
})

// $(window).on('popstate', async e => {
//   const documentSearchParams = new URLSearchParams(document.location.search);
//   const searchParams = new URLSearchParams(document.location.hash ? document.location.hash.substr(1) : document.location.search);
//   if (!documentSearchParams.get('l') && !searchParams.get('l') && searchParams.get('$search')) {
//     aim.search(searchParams.get('$search'));
//   }
// });
