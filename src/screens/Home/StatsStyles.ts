import {StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: statusBarHeight,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    marginVertical: 20,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 30,
    // width: '60%',
  },
  chart: {
    borderRadius: 16,
    paddingRight: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.7,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  habitsList: {
    marginTop: 4,
  },
  habitItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  habitItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitDetails: {
    flex: 1,
    marginLeft: 12,
  },
  habitDescription: {
    marginTop: 4,
    marginBottom: 6,
    opacity: 0.8,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  completedText: {
    marginLeft: 4,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  tableContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tableHeader: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontWeight: '600',
  },
  tableIconCell: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableTitleCell: {
    flex: 2,
    paddingRight: 8,
  },
  tableCategoryCell: {
    flex: 1.2,
    paddingRight: 4,
  },
  tableStatusCell: {
    width: 70,
    alignItems: 'flex-end',
  },
  habitIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
});

export default styles;
