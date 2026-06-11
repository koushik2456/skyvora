import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Skyvora render error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.title}>Something went wrong</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.msg}>{this.state.error.message}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.xl,
    color: Colors.dark.textPrimary,
    marginBottom: Spacing.md,
  },
  scroll: { maxHeight: 240 },
  msg: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.sm,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
});
