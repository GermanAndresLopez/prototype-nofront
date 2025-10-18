export class ProvisioningDirector {
  constructor(builder) {
    this.builder = builder;
  }

  static MACHINE_TYPES = {
    AWS: {
      "General Purpose": {
        "t3.medium": { vcpu: 2, ram: 4 },
        "m5.large": { vcpu: 2, ram: 8 },
        "m5.xlarge": { vcpu: 4, ram: 16 },
      },
      "Memory-Optimized": {
        "r5.large": { vcpu: 2, ram: 16 },
        "r5.xlarge": { vcpu: 4, ram: 32 },
        "r5.2xlarge": { vcpu: 8, ram: 64 },
      },
      "Compute-Optimized": {
        "c5.large": { vcpu: 2, ram: 4 },
        "c5.xlarge": { vcpu: 4, ram: 8 },
        "c5.2xlarge": { vcpu: 8, ram: 16 },
      },
    },
    AZURE: {
      "General Purpose": {
        "D2s_v3": { vcpu: 2, ram: 8 },
        "D4s_v3": { vcpu: 4, ram: 16 },
        "D8s_v3": { vcpu: 8, ram: 32 },
      },
      "Memory-Optimized": {
        "E2s_v3": { vcpu: 2, ram: 16 },
        "E4s_v3": { vcpu: 4, ram: 32 },
        "E8s_v3": { vcpu: 8, ram: 64 },
      },
      "Compute-Optimized": {
        "F2s_v2": { vcpu: 2, ram: 4 },
        "F4s_v2": { vcpu: 4, ram: 8 },
        "F8s_v2": { vcpu: 8, ram: 16 },
      },
    },
    GCP: {
      "General Purpose": {
        "e2-standard-2": { vcpu: 2, ram: 8 },
        "e2-standard-4": { vcpu: 4, ram: 16 },
        "e2-standard-8": { vcpu: 8, ram: 32 },
      },
      "Memory-Optimized": {
        "n2-highmem-2": { vcpu: 2, ram: 16 },
        "n2-highmem-4": { vcpu: 4, ram: 32 },
        "n2-highmem-8": { vcpu: 8, ram: 64 },
      },
      "Compute-Optimized": {
        "n2-highcpu-2": { vcpu: 2, ram: 2 },
        "n2-highcpu-4": { vcpu: 4, ram: 4 },
        "n2-highcpu-8": { vcpu: 8, ram: 8 },
      },
    },
    ONPREM: {
      "Standard": {
        "onprem-std1": { vcpu: 2, ram: 4 },
        "onprem-std2": { vcpu: 4, ram: 8 },
        "onprem-std3": { vcpu: 8, ram: 16 },
      },
      "Memory-Optimized": {
        "onprem-mem1": { vcpu: 2, ram: 16 },
        "onprem-mem2": { vcpu: 4, ram: 32 },
        "onprem-mem3": { vcpu: 8, ram: 64 },
      },
      "Compute-Optimized": {
        "onprem-cpu1": { vcpu: 2, ram: 2 },
        "onprem-cpu2": { vcpu: 4, ram: 4 },
        "onprem-cpu3": { vcpu: 8, ram: 8 },
      },
    },
  };

  buildProvisioning(config) {
    const { provider, machineCategory, machineType } = config;

    // Obtiene specs de vCPU y RAM
    const providerKey = provider.toUpperCase();
    const category = ProvisioningDirector.MACHINE_TYPES[providerKey]?.[machineCategory];
    const type = category?.[machineType];

    if (!type) {
      throw new Error(`Tipo de máquina inválido: ${providerKey} ${machineCategory} ${machineType}`);
    }

    // Configura el builder
    this.builder.reset();
    this.builder.setVMConfig({
      name: config.name,
      os: config.os,
      vcpu: type.vcpu,
      ram: type.ram,
      region: config.region,
    });

    this.builder.setNetworkConfig(config.network);
    this.builder.setStorageConfig(config.storage);

    return this.builder.getProvisioning();
  }
}
