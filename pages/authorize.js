// Module imports
import React from 'react'





// Component imports
import { authenticated } from '../components/AppLayout'
import { actions } from '../store'
import Component from '../components/Component'
import PageWrapper from '../components/PageWrapper'
import HiddenFormData from '../components/HiddenFormData'





@authenticated
class Authorize extends Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  state = {
    submitting: false,
  }

  _formRef = React.createRef()





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ query, store, accessToken }) {
    const {
      client_id: clientId,
      state,
      scope,
      response_type: responseType,
    } = query

    const { payload, status } = await actions.getClientOAuthPage({
      clientId,
      responseType,
      scope,
      state,
    })(store.dispatch)


    if (status === 'success') {
      const {
        client,
        ...oauthProps
      } = payload

      return {
        clientId,
        responseType,
        clientName: client.data.attributes.name,
        redirectUri: client.data.attributes.redirectUri,
        token: accessToken,
        ...oauthProps,
      }
    }

    return {}
  }

  render () {
    const {
      clientId,
      clientName,
      redirectUri,
      responseType,
      scope,
      scopes,
      token,
      transactionId,
    } = this.props
    const { submitting } = this.state

    const hasRequiredParameters = clientId && scope && responseType

    return (
      <PageWrapper title="Authorize Application">
        <div className="page-content">
          {hasRequiredParameters && (
            <>
              <h3>{clientName} is requesting access to your FuelRats account</h3>

              <p><strong>This application will be able to:</strong></p>

              <ul>
                {scopes.map(({ permission, accessible }) => (
                  <li key={permission} className={accessible ? null : 'inaccessible'}>{permission}</li>
                ))}
              </ul>

              <form
                action={`/api/oauth2/authorize?bearer=${token}`}
                method="post"
                ref={this._formRef}>

                <HiddenFormData
                  data={{
                    transaction_id: transactionId,
                    scope,
                    redirectUri,
                  }} />

                <div className="primary">
                  <button
                    className="green"
                    disabled={submitting}
                    name="allow"
                    value="true"
                    type="submit">
                    {submitting ? 'Submitting...' : 'Allow'}
                  </button>

                  <button
                    disabled={submitting}
                    name="cancel"
                    value="true"
                    type="submit">
                    {submitting ? 'Submitting...' : 'Deny'}
                  </button>
                </div>
              </form>
            </>
          )}

          {!hasRequiredParameters && (
            <>
              <header>
                <h3>Invalid Authorize Request</h3>
              </header>

              <p>You loaded this page with missing parameters, please contact the developer of the application you are trying to use</p>
            </>
          )}
        </div>
      </PageWrapper>
    )
  }
}





export default Authorize
