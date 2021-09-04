# SOLOVE
##  A platform to register your marraige on solana 

IT is a program on solana where you can register you marriage , in future you can create NFTs of you moments, create digital wedding card as NFT and much more.

You can event trade - example if wedding invitation NFT belongs to celberity wedding  and only 100 of them were issued it has some worth as it is unique authentic and rare.



## Features

- Register Your marriage
- Genrate Digitally signed certificate and download it
- If both parties agree they can mutually cancel the marriage 
- Count of marriage by a Account

## Tech
- [Anchor] - HTML enhanced for web apps!
- [Rust] - awesome web-based text editor
- [Solana] - Markdown parser done right. Fast and easy to extend.
- [Node js] - great UI boilerplate for modern web apps


## Application
Program is deployed on devnet , PROGRAM_ID : `FCyBRCbnCKee7NLBTn2mD4NoXJD2wmxeCMMEwbA358WL`
A Dapp interacting with the program  **SOLOVE**  is avaialable here [SOLOVE APP LINK ](http://solove.s3-website.ap-south-1.amazonaws.com/)

## Installation

Install the dependencies in package.json using 
```
npm install
```
Build the program`
```
anchor build
```
 Deploy it on solana 
 
 ```
 solana deploy `path` -- path given out by anchor build command where your .so file is located
 ```
 
 Run tests
 ```
 anchot test
```


## How Program works
It implements two processs, All person interacting with the program need to create/initalize  an Account first using their solana wallet.
This part is beign handled by Dapp to create account and intialize it
### Account is intialize with these fields
```
#[account]
pub struct WedAccount {
    pub authority: Pubkey, - Account who has authority to modify the data - it will point to owner address
    pub count: u64, --No of times marriage is initiated
    pub spouse: Pubkey,  -- Account Address of the sposue , Point to self if not married
    pub init_divorce: bool, -- Is divorce process initiated
    pub profile_data: [u8;64], -- IPFS adddress where user profile data is stored
}
```


### Marriage
It is two step process 

--- First: Account1 select Account2 as his/her sposue 

--- Second: Account2 select Account1 as his/her spouse 

Marriage can only happen when `spouse field is pointing to self` that is Account is not married 

If both account has each other as their spouse they are considered married on program .

Person trying to re-marry has to first go through dicovrce process which require mutual consent from both the parties 

And if only one Account has selected the other account as spouse  in that case first preivous marrige initalization needs to be cancelled



### Divorce
It is three step process

---  First: Any of the partner need to initalize the divorce process 

--- Second: Other partner need to accept the divorce and  then he/she can marry someone again 

--- Third: First partner who initalizd the process need to finalize the process so that he/she can marry again

- When divorce is intialize by`Account1` its `init_divorce=true`
- `Account2` see that `Account1` has initalized the divorce `as spouse(Account1) init_divorce=true` now he/she can set his/her Account `spouse field to self` if  he/she want to complete the divorce as both parties has agreed.
- `Account1` sees that `Account2 spouse field is not pointing to Account1` that means divorce has been settled by Account2 or marriage was never accepted in first place so `Account1` can go back and `point it spouse field to self` and is ready to marry again .

### Update
- Account can update his/her profile data ipfs_address




