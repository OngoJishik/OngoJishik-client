import { StyleSheet, Dimensions } from 'react-native';
import { radius } from '../../../tokens/radius';
import { spacing } from '../../../tokens/spacing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;

export const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: spacing.md,
  },
  card: {
    padding: spacing.sm,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 40,
  },
  favoriteBtn: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingVertical: spacing.sm,
  },
  title: {
    marginTop: spacing.xs,
  },
  description: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
