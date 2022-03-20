import { DappKitResponseStatus } from '@celo/utils'
import React, { Suspense } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import Header from '../components/Header'
import { getMobileOperatingSystem, Mobile } from '../utils/mobile'
import Zap from './Zap'
import { RedirectPathToZapOnly } from './Zap/redirects'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bg2};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bg2};
  z-index: 99;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 40px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
  `};

  z-index: 1;
`

const ConstructionBanner = styled.div`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.red3};
  color: white;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  display: flex;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const localStorageKey = 'valoraRedirect'

export default function App() {
  const location = useLocation()
  React.useEffect(() => {
    // Close window if search params from Valora redirect are present (handles Valora connection issue)
    if (typeof window !== 'undefined') {
      const url = window.location.href
      const whereQuery = url.indexOf('?')
      if (whereQuery !== -1) {
        const query = url.slice(whereQuery)
        const params = new URLSearchParams(query)
        if (params.get('status') === DappKitResponseStatus.SUCCESS) {
          localStorage.setItem(localStorageKey, window.location.href)
          const mobileOS = getMobileOperatingSystem()
          if (mobileOS === Mobile.ANDROID) {
            window.close()
          }
        }
      }
    }
  }, [location])
  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <div>
            <Switch>
              <Route exact strict path="/zap" component={Zap} />
              <Route component={RedirectPathToZapOnly} />
            </Switch>
          </div>
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
