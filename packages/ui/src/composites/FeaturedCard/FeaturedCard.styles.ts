import { StyleSheet } from 'react-native';
import { radius } from '../../../tokens/radius';
import { spacing } from '../../../tokens/spacing';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: spacing.md,
  },
  card: {
    padding: spacing.lg,
    height: 150,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  badge: {
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    marginVertical: spacing.xs,
  },
});
