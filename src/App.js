import React from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import AuthProvider from './Context/AuthContext';
import RoomProvider from './Context/RoomContext';
import GameProvider from './Context/GameContext';
import ProtectedRoute from './Context/ProtectedRoute';

import Home from './Pages/Home';
import GameRoom from './Pages/GameRoom';
import Layout from './Components/Layout';
import Login from './Pages/Login';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <RoomProvider>
                <Layout />
              </RoomProvider>
            </ProtectedRoute>
          }
        >
          <Route exact path="/Home" element={<Home />} />
          <Route
            exact
            path="/:roomId"
            element={
              <GameProvider>
                <GameRoom />
              </GameProvider>
            }
          />
          <Route path="/" element={<Navigate to="/Home" replace />} />
        </Route>

        {<Route path="/Login" element={<Login />} />}
      </Routes>
    </AuthProvider>
  );
}

export default App;
