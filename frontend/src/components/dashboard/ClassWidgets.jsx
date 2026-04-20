import { Component } from "react";

// Stateless class component: renders UI from props only (no internal state).
export class UserGreetingCard extends Component {
  render() {
    const { name, goal, dateText } = this.props;
    return (
      <div className="greeting-strip mt-4">
        <p>
          {dateText} | {name ? `Welcome back, ${name}` : "Welcome back"}
          {goal ? ` | Goal: ${goal}` : ""}
        </p>
      </div>
    );
  }
}

// Stateful class component: keeps internal glass counter and triggers parent updates.
export class HydrationStepperCard extends Component {
  constructor(props) {
    super(props);
    this.state = { glasses: 0 };
  }

  addGlass = () => {
    this.setState(
      (prev) => ({ glasses: prev.glasses + 1 }),
      () => {
        const onAdd = this.props.onAdd;
        if (typeof onAdd === "function") {
          onAdd(250);
        }
      }
    );
  };

  reset = () => {
    this.setState({ glasses: 0 });
    const onReset = this.props.onReset;
    if (typeof onReset === "function") {
      onReset();
    }
  };

  render() {
    return (
      <div className="card hover-card">
        <h3 className="text-sm text-[#7B7468]">Quick Hydration (Class Component)</h3>
        <p className="text-2xl font-bold tracking-tight text-[#2F2F2B]">{this.state.glasses} glasses</p>
        <div className="mt-2 flex gap-2">
          <button type="button" className="btn-secondary !py-1.5 text-xs" onClick={this.addGlass}>
            + 1 Glass
          </button>
          <button type="button" className="btn-secondary !py-1.5 text-xs" onClick={this.reset}>
            Reset
          </button>
        </div>
      </div>
    );
  }
}
