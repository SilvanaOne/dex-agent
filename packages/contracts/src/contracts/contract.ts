import {
  Field,
  AccountUpdate,
  UInt64,
  PublicKey,
  state,
  State,
  SmartContract,
  method,
  Bool,
  DeployArgs,
  Permissions,
} from "o1js";
import { RollupDEXState, DEXMap } from "../types/provable-types.js";
import { DEXProof } from "./rollup.js";

const newMap = new DEXMap();
/*
export class RollupDEXState extends Struct({
  poolPublicKey: PublicKey,
  root: Field,
  length: Field,
  actionState: Field, // TODO: check in production
  sequence: UInt64,
}) {
*/

interface DEXContractDeployProps extends Exclude<DeployArgs, undefined> {
  admin: PublicKey;
  uri: string;
}

export class DEXContract extends SmartContract {
  @state(PublicKey) admin = State<PublicKey>();
  @state(Field) root = State<Field>(Field(0));
  @state(Field) length = State<Field>(Field(0));
  @state(Field) actionState = State<Field>(Field(0));
  @state(UInt64) sequence = State<UInt64>(UInt64.from(0));
  @state(UInt64) blockNumber = State<UInt64>(UInt64.from(0));
  /**
   * Deploys the contract with initial settings.
   * @param props - Deployment properties including admin, upgradeAuthority, uri, canPause, and isPaused.
   */
  async deploy(props: DEXContractDeployProps) {
    await super.deploy(props);
    this.admin.set(props.admin);
    this.root.set(newMap.root);
    this.length.set(newMap.length);
    this.actionState.set(Field(0)); // TODO: update in production
    this.sequence.set(UInt64.zero);
    this.blockNumber.set(UInt64.zero);
    this.account.zkappUri.set(props.uri);
    this.account.permissions.set({
      ...Permissions.default(),
      // Allow the upgrade authority to set the verification key
      // even when there is no protocol upgrade
      setVerificationKey:
        Permissions.VerificationKey.proofDuringCurrentVersion(),
      setPermissions: Permissions.impossible(),
      access: Permissions.proof(),
      send: Permissions.proof(),
      setZkappUri: Permissions.proof(),
      setTokenSymbol: Permissions.proof(),
    });
  }

  events = {
    settle: RollupDEXState,
  };

  @method async settle(proof: DEXProof) {
    proof.verify();
    proof.publicInput.blockNumber.assertEquals(proof.publicOutput.blockNumber);

    const sender = this.sender.getUnconstrained();
    const senderUpdate = AccountUpdate.createSigned(sender);
    senderUpdate.body.useFullCommitment = Bool(true);

    this.sequence.requireEquals(proof.publicInput.sequence);
    this.actionState.requireEquals(proof.publicInput.actionState);
    this.root.requireEquals(proof.publicInput.root);
    this.length.requireEquals(proof.publicInput.length);
    this.blockNumber.requireEquals(
      proof.publicInput.blockNumber.sub(UInt64.from(1))
    );

    this.sequence.set(proof.publicOutput.sequence);
    this.actionState.set(proof.publicOutput.actionState);
    this.root.set(proof.publicOutput.root);
    this.length.set(proof.publicOutput.length);
    this.blockNumber.set(proof.publicOutput.blockNumber);
    this.emitEvent("settle", proof.publicOutput);
  }
}
