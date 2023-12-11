import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';

interface User {
  name: {
    first: string;
    last: string;
  };
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const slidingItemRef = useRef<HTMLIonItemSlidingElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=100'); // Get 100 random user from API
      const data = await response.json();
      setUsers(data.results);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. Please try again later.');
    }
  };

  const removeUser = (index: number) => {
    setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
  };

  const handleDelete = (index: number) => {
    removeUser(index);
    setIsDeleting(true);
    closeSlidingItem();
  };

  const handleSwipe = (e: CustomEvent, index: number) => {
    const threshold = 200; // Adjust the threshold value as needed
    const dragDistance = Math.abs(e.detail.deltaX);
  
    if (dragDistance >= threshold && !isDeleting) {
      removeUser(index);
      setIsDeleting(true);
      if (slidingItemRef.current) {
        slidingItemRef.current.closeOpened();
      }
    }
  };

  const closeSlidingItem = () => {
    if (slidingItemRef.current) {
      slidingItemRef.current.close();
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>User List</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            <IonItem>
              <IonLabel>{error}</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {users.map((user, index) => (
            <IonItemSliding key={index} onIonDrag={(e) => handleSwipe(e, index)} ref={slidingItemRef}>
              <IonItem>
                <IonLabel>
                  <h2>{`${user.name.first} ${user.name.last}`}</h2>
                  <p>{user.email}</p>
                </IonLabel>
              </IonItem>
              <IonItemOptions side="end" onIonSwipe={(e) => handleDelete(index)}>
                <IonItemOption color="danger" onClick={() => removeUser(index)}>
                  Remove
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserList;