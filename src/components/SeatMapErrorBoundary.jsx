import React from 'react';

class SeatMapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught seat map error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl text-center space-y-4 my-6">
          <p className="font-bold text-lg">
            Seat map temporarily unavailable. Please refresh or try another section.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SeatMapErrorBoundary;
