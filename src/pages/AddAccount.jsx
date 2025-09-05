import React, { useState } from "react";
import { addAccount } from "../services/accountService";

const AddAccount = () => {
  const [formData, setFormData] = useState({
    accountHolder: "",
    accountType: "",
    balance: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addAccount(formData);
      setMessage("✅ Account created successfully!");
      console.log(result);
    } catch (error) {
      setMessage("❌ Failed to create account.");
    }
  };

  return (
    <div>
      <h2>Add New Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="accountHolder"
          placeholder="Account Holder"
          value={formData.accountHolder}
          onChange={handleChange}
        />
        <input
          type="text"
          name="accountType"
          placeholder="Account Type"
          value={formData.accountType}
          onChange={handleChange}
        />
        <input
          type="number"
          name="balance"
          placeholder="Initial Balance"
          value={formData.balance}
          onChange={handleChange}
        />
        <button type="submit">Add Account</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AddAccount;