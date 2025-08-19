import React, { useContext } from 'react';
import { UserContext } from './App';

export default function WelcomeBanner() {
    const { user } = useContext(UserContext);
    return (
        <h1>{user ? `Hello ${user.first_name || user.username || user.name}` : 'Hello Guest'}</h1>
    );
}