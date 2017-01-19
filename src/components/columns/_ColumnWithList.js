// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { RefreshControl } from 'react-native';

import ColumnWithHeader, { getRadius } from './_ColumnWithHeader';
import TransparentTextOverlay from '../TransparentTextOverlay';
import { EmptyColumnContent } from './EmptyColumn';
import { contentPadding } from '../../styles/variables';
import { getDateWithHourAndMinuteText } from '../../utils/helpers';
import type { Subscription, ThemeObject } from '../../utils/types';

export * from './_ColumnWithHeader';

export const StyledTextOverlay = styled(TransparentTextOverlay) `
  flex: 1;
  border-radius: ${({ radius }) => radius || 0};
`;

export const StyledImmutableListView = styled(ImmutableListView)`
  flex: 1;
  overflow: hidden;
`;

@withTheme
export default class extends React.PureComponent {
  props: {
    errors?: ?Array<string>,
    headerRight?: React.Element,
    icon: string,
    initialListSize?: number,
    isEmpty?: boolean,
    items: Array<Object>,
    loading?: boolean,
    radius?: number,
    refreshFn?: Function,
    refreshText?: string,
    renderRow: Function,
    renderSectionHeader?: Function,
    style?: ?Object,
    readIds: Array<string>,
    sectionHeaderHasChanged?: Function,
    subscriptions: Array<Subscription>,
    theme: ThemeObject,
    title: string,
    updatedAt?: Date,
    width?: number,
  };

  render() {
    const {
      initialListSize,
      isEmpty,
      items,
      loading,
      refreshFn,
      refreshText: _refreshText,
      renderRow,
      renderSectionHeader,
      sectionHeaderHasChanged,
      theme,
      updatedAt,
      ...props
    } = this.props;

    const _radius = getRadius(props);

    let refreshText = _refreshText;
    if (!refreshText && updatedAt) {
      const dateFromNowText = getDateWithHourAndMinuteText(updatedAt);
      refreshText = dateFromNowText ? `Updated ${dateFromNowText}` : '';
    }

    const refreshControl = (
      (refreshFn || refreshText) &&
      <RefreshControl
        refreshing={false}
        onRefresh={refreshFn}
        colors={[loading || !refreshFn ? 'transparent' : theme.base07]}
        tintColor={loading || !refreshFn ? 'transparent' : theme.base07}
        title={(refreshText || ' ').toLowerCase()}
        titleColor={theme.base05}
        progressBackgroundColor={theme.base02}
      />
    );

    return (
      <ColumnWithHeader {...this.props}>
        <StyledTextOverlay color={theme.base02} size={contentPadding} from="vertical" radius={_radius}>
          {
            isEmpty || !(items.size > 0)
              ? <EmptyColumnContent key="empty-column" refreshControl={refreshControl} />
              : (
                <StyledImmutableListView
                  immutableData={items}
                  initialListSize={initialListSize || 5}
                  rowsDuringInteraction={initialListSize || 5}
                  renderRow={renderRow}
                  renderSectionHeader={renderSectionHeader}
                  refreshControl={refreshControl}
                  sectionHeaderHasChanged={sectionHeaderHasChanged}
                  contentContainerStyle={{ overflow: 'hidden' }}
                  removeClippedSubviews
                />
              )
          }
        </StyledTextOverlay>
      </ColumnWithHeader>
    );
  }
}