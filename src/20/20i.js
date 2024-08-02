/**
 * @param {string} input
 */
module.exports = (input) => {
  const broadcaster = buildModulesGraph(input).broadcaster;

  let lowPulses = 0;
  let highPulses = 0;

  for (let i = 0; i < 1000; i++) {
    const resultPulses = performOneFullPulsePropagation(broadcaster);

    lowPulses += resultPulses.lowPulses;
    highPulses += resultPulses.highPulses;
  }

  return lowPulses * highPulses;
};

const HIGH = true;
const LOW = false;

class Module {
  children = [];

  static create(prefix) {
    if (!prefix) {
      return new Broadcaster();
    } else if (prefix === "%") {
      return new FlipFlop();
    } else {
      return new Conjunction();
    }
  }

  setChildren(children) {
    this.children = [...children];
  }

  addInputModule(inputModule) {}
  propagatePulse(inputModule, pulse) {}
}

class Broadcaster extends Module {
  propagatePulse(_, pulse) {
    return pulse;
  }
}

class FlipFlop extends Module {
  state = false;

  propagatePulse(_, pulse) {
    if (pulse === LOW) {
      if (this.state) {
        this.state = false;
        return LOW;
      } else {
        this.state = true;
        return HIGH;
      }
    }
  }
}

class Conjunction extends Module {
  inputModules = new Map();

  addInputModule(inputModule) {
    this.inputModules.set(inputModule, LOW);
  }

  propagatePulse(inputModule, pulse) {
    this.inputModules.set(inputModule, pulse);

    if (pulse === LOW) {
      return HIGH;
    }

    const doesRememberOnlyHighs = [...this.inputModules.values()].every(
      (pulse) => pulse === HIGH
    );
    return doesRememberOnlyHighs ? LOW : HIGH;
  }
}

const buildModulesGraph = (input) => {
  const moduleConfiguration = input.split("\n").map((line) => {
    const [senderName, receivers] = line.split(" -> ");

    return {
      prefix: senderName.match(/[%&]/)?.[0] ?? null,
      senderName: senderName.replace(/[%&]/, ""),
      receiversNames: receivers.split(", "),
    };
  });

  const modules = {};
  moduleConfiguration.forEach(({ prefix, senderName }) => {
    const module = Module.create(prefix);

    modules[senderName] = module;
  });

  moduleConfiguration.forEach(({ senderName, receiversNames }) => {
    const sender = modules[senderName];
    const receivers = receiversNames.map((name) => {
      if (!modules[name]) {
        modules[name] = Module.create();
      }
      return modules[name];
    });

    sender.setChildren(receivers);

    receivers.forEach((receiver) => {
      receiver.addInputModule(sender);
    });
  });

  return modules;
};

const performOneFullPulsePropagation = (
  broadcaster,
  onPulseCallback = (pulse) => {}
) => {
  let lowPulses = 0;
  let highPulses = 0;

  const pulsesQueue = [{ source: null, type: LOW, target: broadcaster }];

  while (pulsesQueue.length) {
    const pulse = pulsesQueue.shift();

    if (pulse.type === LOW) {
      lowPulses++;
    } else {
      highPulses++;
    }

    onPulseCallback(pulse);

    if (!pulse.target) continue;

    const propagatedPulseType = pulse.target.propagatePulse(
      pulse.source,
      pulse.type
    );

    if (propagatedPulseType !== undefined) {
      const propagatedPulses = pulse.target.children.map((child) => ({
        source: pulse.target,
        type: propagatedPulseType,
        target: child,
      }));

      pulsesQueue.push(...propagatedPulses);
    }
  }
  return { lowPulses, highPulses };
};

module.exports.buildModulesGraph = buildModulesGraph;
module.exports.performOneFullPulsePropagation = performOneFullPulsePropagation;
