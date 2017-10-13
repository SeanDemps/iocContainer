class IocContainer {
  constructor() {
      this.serviceMap = new Map();
  }

  register(Service, ServiceName, dependencyNames = []) {
      this._errorOnServiceNameNotString(ServiceName);
      this._errorOnDependencyNamesNotArray(dependencyNames);
      this.serviceMap.set(ServiceName, {
          Service,
          dependencyNames
      });
  }

  create(serviceName) {
      this._errorOnServiceNameNotString(serviceName);
      return this._initialiseService(serviceName);
  }

  _initialiseService(serviceName, dependenciesInBranch = []) {
    const serviceObject = this.serviceMap.get(serviceName);
    if (!serviceObject) {
        throw new Error(serviceName + ' is not registered');
    }

    const { Service, dependencyNames } = serviceObject;
    this._errorOnPreviousInitialization(dependenciesInBranch, serviceName);

    const initialisedDependencies = dependencyNames.map((name) => this._initialiseService(name, [...dependenciesInBranch, serviceName]));
    return new Service(...initialisedDependencies);
  }

  _errorOnPreviousInitialization(dependencies, serviceName) {
    const serviceIndex = dependencies.indexOf(serviceName);
    if (serviceIndex !== -1) {
       throw new Error('Circular dependency detected: ' + dependencies.slice(serviceIndex, dependencies.length).join('->') + '->' + serviceName);
    }
  }

  _errorOnServiceNameNotString(name) {
    if (typeof name !== 'string') {
      throw new TypeError('Service name must be provided as a string');
    }
  }

  _errorOnDependencyNamesNotArray(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Dependency names must be provided as an array');          
    }
  }
}

module.exports = IocContainer;
