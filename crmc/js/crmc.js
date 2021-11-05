$().on('load', async function () {
  const client_id = '5beb9f0d-92b2-4046-9b85-992c944ad032';
  const aimConfig = {
    client_id: client_id,
    scope: 'openid profile name email admin.write',
  };
  const aimClient = new Aim.UserAgentApplication(aimConfig);
  const aimAccount = JSON.parse(aimClient.storage.getItem('aimAccount'));
  const aimRequest = {
    scopes: aimConfig.scope.split(' '),
  };
  if (!aimAccount) {
    function signIn() {
      aimClient.loginPopup(aimRequest).catch(console.error).then(authResult => {
        aimClient.storage.setItem('aimAccount', authResult.account.username);
        document.location.reload();
      });
    }
    $(document.body).append(
      $('button').text('login').on('click', signIn),
    )
  } else {
    const authProvider = {
      getAccessToken: async () => {
        let account = aimClient.storage.getItem('aimAccount');
        if (!account){
          throw new Error(
            'User account missing from session. Please sign out and sign in again.'
          );
        }
        try {
          // First, attempt to get the token silently
          const silentRequest = {
            scopes: aimRequest.scopes,
            account: aimClient.getAccountByUsername(account)
          };
          const silentResult = await aimClient.acquireTokenSilent(silentRequest);
          return silentResult.accessToken;
        } catch (silentError) {
          // If silent requests fails with InteractionRequiredAuthError,
          // attempt to get the token interactively
          if (silentError instanceof Aim.InteractionRequiredAuthError) {
            const interactiveResult = await aimClient.acquireTokenPopup(aimRequest);
            return interactiveResult.accessToken;
          } else {
            throw silentError;
          }
        }
      }
    };
    let dmsConfig = {
      client_id: client_id,
      servers: [{url: 'https://dms.aliconnect.nl'}],
    };
    const dmsClient = Aim.Client.initWithMiddleware({authProvider}, dmsConfig);
    function signOut() {
      aimClient.logout().catch(console.error).then(e => {
        aimClient.storage.removeItem('aimAccount');
        document.location.reload();
      });
    }
    function contacten() {
      dmsClient.api('/Contacten').get().then(body => {
        const rows = body.values;
      })
    }
    function createLijst(rows){
      const keys = Object.keys(rows[0]||{});
      $('lijst').text('').append(
        $('thead').append(
          $('tr').append(
            keys.map(key => $('th').text(key))
          ),
        ),
        $('tbody').append(
          rows.map(row => $('tr').append(
            keys.map(key => $('td').text(row[key] || ''))
          ))
        ),
      )
    }
    dmsConfig = await dmsClient.loadConfig();
    console.log(dmsConfig);
    $(document.body).append(
      $('nav').class('top').append(
        Object.entries(dmsConfig.components.schemas)
        .filter(([name,schema]) => schema.table)
        .map(([name,schema]) => $('button').text(name).on('click', e => {
          dmsClient.api('/'+name).get().then(body => createLijst(body.values||[]))
        })),
        $('button').text('logout').on('click', signOut),
      ),
      $('table').id('lijst'),
    )
  }
});
