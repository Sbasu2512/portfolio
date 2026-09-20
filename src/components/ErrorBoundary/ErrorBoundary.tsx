import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./ErrorBoundary.module.scss";

interface Props { children: ReactNode }
interface State { error: Error | null }

/**
 * Last line of defense: if anything below this throws during render or in
 * an effect (a WebGL context refusing to init, a texture failing to decode,
 * etc.), React's default behavior is to unmount the entire tree and leave
 * <div id="root"></div> empty. This keeps a visible, recoverable page up
 * instead.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled error in the app tree:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.wrap} role="alert">
          <div className={styles.card}>
            <h1>Something didn't load</h1>
            <p>A visual effect on this page failed to start. The rest of the site is unaffected.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
