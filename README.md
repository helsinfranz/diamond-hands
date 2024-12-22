# Diamond Hands 💎✋

Diamond Hands is a Solana-based decentralized application (dApp) for time-locked fund transfers. Users can:

1. **Create a Bank** 🏦: Lock funds into a secure account with a time-based release.
2. **Withdraw Funds** 💸: Retrieve funds after the specified timestamp.

---

## Features

- **Time-Locked Funds**: Securely lock funds until a specific timestamp.
- **Flexible Recipient**: Specify the recipient who will receive the funds after the lock expires.
- **Error Handling**: Prevent premature withdrawals with robust error checking.

---

## Prerequisites

Before running the program, ensure you have the following installed:

1. **Rust**: [Install Rust](https://www.rust-lang.org/tools/install)
2. **Anchor CLI**: [Install Anchor](https://book.anchor-lang.com/chapter_3/installation.html)
3. **Solana CLI**: [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
4. **Node.js** (optional for testing): [Install Node.js](https://nodejs.org)

---

## Running the Program

### 1. Clone the Repository

```bash
git clone <repository-url>
cd diamond-hands
```

### 2. Build the Program

Compile the program with Anchor:

```bash
anchor build
```

### 3. Deploy the Program

Deploy to your local Solana validator:

```bash
anchor deploy
```

### 4. Set Up Local Validator

Start a Solana local validator:

```bash
solana-test-validator
```

Connect Anchor to the local cluster:

```bash
solana config set --url localhost
```

---

## Usage

### Initialize the Program

Run the `create_bank` instruction to lock funds into the Diamond Hands account:

```bash
anchor test --skip-build
```

### Key Instructions

- **Create Bank**: Lock a specified amount of funds into a secure PDA with a withdrawal timestamp.
- **Withdraw Bank**: Release the locked funds to the specified recipient after the timestamp.

---

## Testing

Anchor comes with a built-in testing framework. To run all tests, execute:

```bash
anchor test
```

---

## Program Structure

- **Bank PDA**: Manages the locked funds, storing:
  - Sender's wallet.
  - Receiver's wallet.
  - Locked amount.
  - Timestamp for withdrawal.
- **Error Codes**:
  - `HandsTooWeak`: Triggered when trying to withdraw funds before the timestamp.
  - `WrongAccount`: Triggered when an invalid sender or receiver is used.

---

## Error Handling

- **HandsTooWeak**: Prevents premature withdrawals.
- **WrongAccount**: Ensures funds can only be withdrawn by the intended recipient.

---

## Contributing

Feel free to fork this project and contribute to its development. For major changes, open an issue to discuss your ideas.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
