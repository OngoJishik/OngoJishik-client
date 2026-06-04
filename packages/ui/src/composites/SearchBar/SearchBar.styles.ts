import { StyleSheet } from 'react-native';
import { radius } from '../../../tokens/radius';
import { spacing } from '../../../tokens/spacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.xs,
  },
  actionIcon: {
    marginLeft: spacing.sm,
  },
});
