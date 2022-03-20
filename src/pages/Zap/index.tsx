import { ErrorBoundary } from '@sentry/react'
import ChangeNetworkModal from 'components/ChangeNetworkModal'
import Loader from 'components/Loader'
import { useIsSupportedNetwork } from 'hooks/useIsSupportedNetwork'
import { FarmBotSummary, useFarmBotRegistry } from 'pages/Compound/useFarmBotRegistry'
import ZapCard from 'pages/Zap/ZapCard'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ColumnCenter } from '../../components/Column'
import { DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'

const VoteCard = styled(DataCard)`
  overflow: hidden;
  margin-bottom: 16px;
`

const PageWrapper = styled.div`
  width: 100%;
  max-width: 640px;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`

const PoolWrapper = styled.div`
  margin-bottom: 12px;
`

const Header: React.FC = ({ children }) => {
  return (
    <DataRow style={{ alignItems: 'baseline', marginBottom: '12px' }}>
      {/* <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{children}</TYPE.mediumHeader> */}
    </DataRow>
  )
}

export default function Zap() {
  const { t } = useTranslation()
  const isSupportedNetwork = useIsSupportedNetwork()
  const [stakedFarms, setStakedFarms] = useState<FarmBotSummary[]>([])
  const [unstakedFarms, setUnstakedFarms] = useState<FarmBotSummary[]>([])

  const farmbotFarmSummaries = useFarmBotRegistry()

  useEffect(() => {
    setStakedFarms(
      farmbotFarmSummaries.filter((botsummary) => {
        return botsummary.amountUserLP > 0
      })
    )
    setUnstakedFarms(
      farmbotFarmSummaries.filter((botsummary) => {
        return botsummary.amountUserLP <= 0
      })
    )
  }, [farmbotFarmSummaries])

  if (!isSupportedNetwork) {
    return <ChangeNetworkModal />
  }

  return (
    <PageWrapper>
      <ColumnCenter>{farmbotFarmSummaries.length === 0 && <Loader size="48px" />}</ColumnCenter>
      {stakedFarms.length > 0 && (
        <>
          {stakedFarms.map((farmSummary) => (
            <PoolWrapper key={farmSummary.address}>
              <ErrorBoundary>
                <ZapCard farmBotSummary={farmSummary} />
              </ErrorBoundary>
            </PoolWrapper>
          ))}
        </>
      )}
      {unstakedFarms.length > 0 && (
        <>
          {unstakedFarms.map((farmSummary) => (
            <PoolWrapper key={farmSummary.address}>
              <ErrorBoundary>
                <ZapCard farmBotSummary={farmSummary} />
              </ErrorBoundary>
            </PoolWrapper>
          ))}
        </>
      )}
    </PageWrapper>
  )
}
