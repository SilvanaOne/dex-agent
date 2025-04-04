# Silvana DEX POC

Ultrafast zk-rollup for trading Mina Fungible Tokens

App: https://dex.silvana.dev

Explorer: https://silvascan.io/testnet/home

## Confirmation times

Transaction pre-confirmation time: 600 ms

User can send the next transaction immediately after receiving the confirmation, relying on the updated state both for his account and the accounts for other users

Proof creation time for the block of transactions: from 10 sec to few min, depending on the number of transactions in the rollup block

Settlement time: settlement tx is included in the Mina protocol block within 3-6 minutes

## Layers

### Settlement: Mina protocol devnet

### ZK coordination layer: Sui devnet

- sequencing of transactions
- validating of the transactions inputs, calculating and keeping optimistic state
- orchestration of proof calculation and merging
- keeping the pointers to data availability layer for proofs

### Data availability layer: IPFS or Walrus

DA layer can be switched in packages/lib/da-hub.ts

- Storage of zk-rollup blocks state
- Storage of proofs and the state for the tx(s) proved

### Wallet: Auro wallet

Txs are signed using mina.signFields() methods

## Future work

- direct verification of signatures produced by Auro Wallet on sui: when Mina crypto primitives will be available on sui
- calculation of IndexedMerkleMap root on sui: when Mina-compatible Poseidon hash will be available on sui
- adding Project Untitled support and using polynomial commitments to verify data stored on data availability layer: when Project Untitled will be available.

## Packages

### contracts

- Mina ZkProgram - proving rollup state transitions
- Mina SmartContract - settlement on Mina protocol
- Provable data structures
- Proof generation
- Proof merging
- Settlement transactions
- Provable state calculations
- Provable state and proofs storage in data availability layer

### lib

- Typescript (non-provable) data types
- Fetch and conversion utilities
- zk coordination layer transactions
- data availability layer utils and switching between layers
- preparation of the data for the frontend

### coordination

- move contract for sui handling rollup transactions validation, optimistic state calculations and proof calculation and merging orchestration

### agent

- Silvana zkProver agent preparing the proofs in the cloud

### ui

- User interface

### client

- deployment scripts
- test scripts

### config

- creating and updating config object on sui keeping track of contract addresses on Mina and sui (used by agent and frontend)
