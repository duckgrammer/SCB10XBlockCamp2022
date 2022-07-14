pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

//Safe Math Interface
contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
 
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
 
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
 
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}
 
 
//ERC Token Standard #20 Interface
contract ERC20Interface {
    // ERC20 Mandatory Functions
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
 
    // DAI Token Functions
    function withdraw(uint tokens) public returns (bool success);
    function deposit(uint tokens) public returns (bool success);
    function createAccount(string accountName) public returns (bool success);
    function accountInfo(string accountName) public constant returns (uint);
    function myWithdraw(string accountName, uint tokens) public returns (bool success);
    function myDeposit(string accountName, uint tokens) public returns (bool success);
    function myTransfer(string accountNameFrom, string accountNameTo, uint tokens) public returns (bool success);
    function myAccounts() public constant returns (string[] names);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}
 
 
//Contract function to receive approval and execute function in one call
contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes data) public;
}
 
//Actual token contract
contract DAIToken is ERC20Interface, SafeMath {
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;
 
    mapping(address => uint) balances;
    struct Set{
        string[] account_names;
        mapping(string => uint) account_balance;
    }
    Set my_accounts;
    mapping(address => mapping(address => uint)) allowed;
 
    constructor() public {
        symbol = "DAI";
        name = "DAI Token";
        decimals = 2;
        _totalSupply = 100000;
        balances[0x9EF13666C9c446Bb5cEe2bC02d8AD53F8758fDFF] = _totalSupply;
        emit Transfer(address(0), 0x9EF13666C9c446Bb5cEe2bC02d8AD53F8758fDFF, _totalSupply);
    }

    function createAccount(string accountName) public returns (bool success) {
        my_accounts.account_names.push(accountName);
        my_accounts.account_balance[accountName] = 0;
        return true;
    }

    function accountInfo(string accountName) public constant returns (uint) {
        return my_accounts.account_balance[accountName];
    }

    function myWithdraw(string accountName, uint tokens) public returns (bool success) {
        my_accounts.account_balance[accountName] = safeSub(my_accounts.account_balance[accountName], tokens);
        return true;
    }

    function myDeposit(string accountName, uint tokens) public returns (bool success) {
        my_accounts.account_balance[accountName] = safeAdd(my_accounts.account_balance[accountName], tokens);
        return true;
    }

    function myTransfer(string accountNameFrom, string accountNameTo, uint tokens) public returns (bool success) {
        myWithdraw(accountNameFrom, tokens);
        myDeposit(accountNameTo, tokens);
        return true;
    }

    function myAccounts() public constant returns (string[] names) {
        return my_accounts.account_names;
    }

    function withdraw(uint tokens) public returns (bool success) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        emit Transfer(address(this), msg.sender, tokens);
        return true;
    }

    function deposit(uint tokens) public returns (bool success) {
        balances[msg.sender] = safeAdd(balances[msg.sender], tokens);
        emit Transfer(msg.sender, address(this), tokens);
        return true;
    }
 
    function totalSupply() public constant returns (uint) {
        return _totalSupply  - balances[address(0)];
    }
 
    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }
 
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
 
    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
 
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
 
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
 
    function approveAndCall(address spender, uint tokens, bytes data) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, this, data);
        return true;
    }
 
    function () public payable {
        revert();
    }
}