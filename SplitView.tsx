import React from 'react'
import { useWindowDimensions, StyleSheet, View } from 'react-native'

export function useIsTablet() {
  const windowSize = useWindowDimensions()
  return windowSize.width >= 756 // 50% the size of 14 inch macbook pro
}

export interface SplitViewProps {
  master: React.ReactNode
  detail: React.ReactNode
}

export function SplitView({ master, detail }: SplitViewProps) {
  const isTablet = useIsTablet()

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {isTablet && (
        <View
          style={{
            flex: 1,
            maxWidth: 400,
          }}
        >
          {master}
        </View>
      )}

      <View
        style={{
          width: StyleSheet.hairlineWidth,
          backgroundColor: '$cardBorder',
        }}
      />

      <View
        style={{
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {detail}
      </View>
    </View>
  )
}
