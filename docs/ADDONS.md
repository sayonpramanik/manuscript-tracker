# Add-on contract

R-MANTRA follows a pedalboard model: the publication-project core is stable, while optional add-ons connect specialist writing, reference, discovery, integrity and publishing tools.

## Current status

The in-app catalogue distinguishes three states:

- **Included:** implemented in this repository and available in the Community edition.
- **Connector:** implemented but requires the deployer to configure an external service.
- **Planned:** a product contract and roadmap entry, not a working integration.

The status label must not be removed or softened in marketing material.

## Permission requirements

Every future add-on must declare:

1. Which project fields and files it reads.
2. Which records it can create or modify.
3. Every network destination it contacts.
4. Whether unpublished text leaves the deployment.
5. Its retention and deletion behaviour.
6. External fees or licence requirements.
7. Whether an administrator can install it privately.

Add-ons should be disabled by default when they transmit manuscript content. Enabling one must not silently enable another.

## Planned technical boundary

The current catalogue is a typed manifest in `lib/addons.ts`. A later extension SDK can evolve this into signed manifests, scoped server-side adapters, events/webhooks, version compatibility and a sandboxed user interface. Until those controls exist, contributors should add integrations as narrow server routes and document their data flow.
