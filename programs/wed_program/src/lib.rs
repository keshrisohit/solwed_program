use anchor_lang::prelude::*;

#[program]
pub mod wed_program {
    use super::*;
  
    pub fn create(ctx: Context<Create>, authority: Pubkey, profile_data:[u8;64]) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.spouse= *my_account.to_account_info().key;
        my_account.authority = authority;
        my_account.init_divorce=false;
        my_account.count = 0;
        my_account.profile_data=profile_data;
        Ok(())
    }

    pub fn marry(ctx: Context<Marry>) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        let spouse_account = &mut ctx.accounts.spouse_account;
        // if poinitng to self initialize the marriage , else do not allow to init , settle the previous one
        if my_account.spouse == *my_account.to_account_info().key {
            my_account.spouse=*spouse_account.to_account_info().key;
            my_account.count += 1;
            my_account.init_divorce=false;
           
        } 
        Ok(())
    }

    pub fn update(ctx: Context<UpdateProfile>,profile_data:[u8;64]) -> ProgramResult {
        //update the profile
        let my_account = &mut ctx.accounts.my_account;
            my_account.profile_data=profile_data;
        Ok(())
    }


    pub fn divorce(ctx: Context<Divorce>,) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        let spouse_account = &mut ctx.accounts.spouse_account;
        if my_account.spouse == *spouse_account.to_account_info().key && spouse_account.spouse == *my_account.to_account_info().key && spouse_account.init_divorce==false
        {
            //marriage was accepted as each other spouse and other party has not  initaited the divroce
            my_account.init_divorce=true;
 
        }

        if my_account.spouse == *spouse_account.to_account_info().key && spouse_account.spouse == *my_account.to_account_info().key && spouse_account.init_divorce==true
        {
            //marriage was accepted as each other spouse and other party has initaited the divroce // finalize the divorce point back to self
        
            my_account.spouse= *my_account.to_account_info().key;
            my_account.init_divorce=false;
        }

        if my_account.spouse == *spouse_account.to_account_info().key && spouse_account.spouse != *my_account.to_account_info().key 
        {
            //marriage was not accepted in first place, go back to self and die alone
            my_account.spouse= *my_account.to_account_info().key;
            my_account.init_divorce=false;
        }

        
        Ok(())
    }

}


#[derive(Accounts)]
pub struct Marry<'info> {
    #[account(mut, has_one = authority,  constraint = my_account.spouse== *my_account.to_account_info().key)]
    pub my_account: ProgramAccount<'info, WedAccount>,
    pub spouse_account : ProgramAccount<'info, WedAccount>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,

}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut, has_one = authority)]
    pub my_account: ProgramAccount<'info, WedAccount>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,

}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init)]
    pub my_account: ProgramAccount<'info, WedAccount>,
}

#[derive(Accounts)]
pub struct Divorce<'info> {
    #[account(mut, has_one = authority)]
    pub my_account: ProgramAccount<'info, WedAccount>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(   
        constraint = my_account.spouse == *spouse_account.to_account_info().key,
    )]
    pub spouse_account : ProgramAccount<'info, WedAccount>,

}



#[account]
pub struct WedAccount {
    pub authority: Pubkey,
    pub count: u64,
    pub spouse: Pubkey, 
    pub init_divorce: bool,
    pub profile_data: [u8;64],
}
