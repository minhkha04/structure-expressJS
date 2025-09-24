import { env } from '../config/environment.js'
import { ACCOUNT_TYPE } from '../contants/account-type.contant.js';
import { ROLE } from '../contants/role.contant.js'
import { UserRepository } from '../repositories/user.repository.js';
import { hash } from '../utils/bcrypt.util.js';

export const CreateAccountSeed = async () => {
    const email = env.ADMIN_EMAIL;
    const password = env.ADMIN_PASSWORD;

    let user = await UserRepository.findUserByEmail(email, ACCOUNT_TYPE.LOCAL);
    if (!user) {
        user = await UserRepository.createUser({
            email,
            password: await hash(password),
            accountType: ACCOUNT_TYPE.LOCAL,
            role: ROLE.ADMIN,
        });
    }
    console.log('Admin account have been created with email: ', email, ' password: ', password);
};
