import BN from "bn.js";
import assert from "assert";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DiamondHands } from "../target/types/diamond_hands";
import { PublicKey, Keypair } from "@solana/web3.js";
import assert from "assert";import type { DiamondHands } from "../target/types/diamond_hands";


describe("diamond_hands", () => {  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DiamondHands as anchor.Program<DiamondHands>;
  

  // Configure the client.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DiamondHands as Program<DiamondHands>;

  // Create keypairs for sender and receiver

  const sender = pg.wallets.wallet1.keypair;
  const receiver = pg.wallets.wallet2.keypair;
  const wrongUser = Keypair.generate(); // Wrong user's keypair

  let bankAccount: PublicKey;
  const timestamp = new anchor.BN(Date.now() / 1000 + 20); // Timelock 1000 seconds in the future

  // Test case: Should create a bank account
  it("Should create a bank account", async () => {
    // const timestamp = new anchor.BN(Date.now() / 1000 + 1000); // Timelock 1000 seconds in the future
    const amount = new anchor.BN(10000000); // Amount to be deposited

    // Derive the PDA for the bank account
    const [bankAccount1, bankBump] = await PublicKey.findProgramAddress(
      [
        sender.publicKey.toBuffer(),
        receiver.publicKey.toBuffer(),
        Buffer.from(timestamp.toString()),
      ],
      program.programId
    );

    console.log(bankAccount1.toString());

    await program.rpc.createBank(timestamp, amount, {
      accounts: {
        bank: bankAccount1,
        sender: sender.publicKey,
        receiver: receiver.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [sender],
    });

    // Fetch bank account details
    await delay(2000);
    const bank = await program.account.bank.fetch(bankAccount1);
    bankAccount = bankAccount1;

    // Assertion checks
    assert.equal(bank.sender.toString(), sender.publicKey.toString());
    assert.equal(bank.receiver.toString(), receiver.publicKey.toString());
    assert.equal(bank.amount.toNumber(), amount.toNumber());
    assert.equal(bank.timestamp.toNumber(), timestamp.toNumber());
  });

  // Test case: Should fail to withdraw before timelock
  it("Should fail to withdraw before timelock", async () => {
    // const timestamp = new anchor.BN(Math.floor(Date.now() / 1000) + 500); // Timelock 500 seconds in the future

    // Expect rejection with specific error code
    await assert.rejects(
      program.rpc.withdrawBank(timestamp, {
        accounts: {
          bank: bankAccount,
          sender: sender.publicKey,
          receiver: receiver.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [receiver],
      }),
      (err: Error) => {
        assert.equal(
          err.message,
          "AnchorError occurred. Error Code: HandsTooWeak. Error Number: 6000. Error Message: HandsTooWeak."
        );
        return true;
      }
    );
  });

  // Test case: Should fail for wrong user to withdraw
  it("Should fail for wrong user to withdraw", async () => {
    // const timestamp = new anchor.BN(Math.floor(Date.now() / 1000) - 500); // Timelock expired 500 seconds ago

    // Expect rejection with specific error code
    await assert.rejects(
      program.rpc.withdrawBank(timestamp, {
        accounts: {
          bank: bankAccount,
          sender: wrongUser.publicKey, // Use wrong user's public key here
          receiver: receiver.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [receiver],
      }),
      (err: Error) => {
        return true;
      }
    );
  });

  // Test case: Should withdraw after timelock
  it("Should withdraw after timelock", async () => {
    // const timestamp = new anchor.BN(Math.floor(Date.now() / 1000) - 500); // Timelock expired 500 seconds ago

    console.log("Pausing for 20 seconds...");
    await delay(20000);
    console.log("Resuming after 20 seconds.");
    // Execute withdrawal transaction
    await program.rpc.withdrawBank(timestamp, {
      accounts: {
        bank: bankAccount,
        sender: sender.publicKey,
        receiver: receiver.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [receiver],
    });
  });
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    let current = start;
    while (current - start < ms) {
      current = Date.now();
    }
    resolve();
  });
}
