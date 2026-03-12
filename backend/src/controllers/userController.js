import { getMongoClient } from '../config/auth.js';

export const getUserById = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const client = await getMongoClient();
        const db = client.db();
        
        // Try to find user by 'id' field first (Better Auth standard)
        let user = await db.collection('user').findOne({ id: userId });
        
        // If not found, try with MongoDB's _id field
        if (!user) {
            try {
                const { ObjectId } = await import('mongodb');
                user = await db.collection('user').findOne({ _id: new ObjectId(userId) });
            } catch (objectIdError) {
                // If ObjectId conversion fails, try as string _id
                user = await db.collection('user').findOne({ _id: userId });
            }
        }
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Ensure user has proper default values
        const processedUser = {
            ...user,
            role: user.role || 'user',
            verifiedStatus: user.verifiedStatus || 'pending'
        };
        
        res.json(processedUser);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error while fetching user' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const client = await getMongoClient();
        const db = client.db();
        
        // Return all users except admins, including Google OAuth users
        // Make sure to include users with null/undefined role (default to 'user')
        const users = await db.collection('user').find({ 
            $or: [
                { role: { $ne: 'admin' } },
                { role: { $exists: false } },
                { role: null }
            ]
        }).toArray();
        
        // Ensure all users have proper default values
        const processedUsers = users.map(user => ({
            ...user,
            role: user.role || 'user',
            verifiedStatus: user.verifiedStatus || 'pending'
        }));
        
        res.json(processedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error while fetching users' });
    }
};

export const updateUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body; // approved, rejected

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const client = await getMongoClient();
        const db = client.db();
        
        // Better Auth typically uses 'id' field, but we'll try both for compatibility
        let result;
        
        // First try with the 'id' field (Better Auth standard)
        result = await db.collection('user').updateOne(
            { id: userId },
            { $set: { verifiedStatus: status } }
        );
        
        // If no match found, try with MongoDB's _id field
        if (result.matchedCount === 0) {
            try {
                const { ObjectId } = await import('mongodb');
                result = await db.collection('user').updateOne(
                    { _id: new ObjectId(userId) },
                    { $set: { verifiedStatus: status } }
                );
            } catch (objectIdError) {
                // If ObjectId conversion fails, the userId format is invalid
                console.log('Invalid ObjectId format, trying as string _id');
                result = await db.collection('user').updateOne(
                    { _id: userId },
                    { $set: { verifiedStatus: status } }
                );
            }
        }

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: `User status updated to ${status} successfully` });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Internal server error while updating user status' });
    }
};
