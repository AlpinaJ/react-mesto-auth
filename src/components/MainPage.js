import React, {useState, useEffect} from 'react';
import Main from "./Main";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function MainPage() {
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
    const [selectedCard, setSelectedCards] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);

    const handleEditAvatarClick = () => setEditAvatarPopupOpen(true);
    const handleEditProfileClick = () => setEditProfilePopupOpen(true);
    const handleAddPlaceClick = () => setAddPlacePopupOpen(true);
    const handleCardClick = (card) => setSelectedCards(card);

    function closeAllPopups() {
        setEditProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setEditAvatarPopupOpen(false);
        setSelectedCards({});
    }

// Подключаем закрытие попапов нажатием клавиши Escape
    useEffect(() => {
        function handleEscapeClose(event) {
            if (event.code === 'Escape') {
                closeAllPopups();
            }
        }

        document.addEventListener('keydown', handleEscapeClose)
        return () => document.removeEventListener('keydown', handleEscapeClose)
    });

    useEffect(() => {
        api.getUserInfo().then(res => {
            setCurrentUser(res);
        }).catch(err => {
            console.log(err);
        });
        api.getInitialCards().then(res => {
            setCards(res);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id).then(() => {
            setCards((state) => state.filter((c) => c._id !== card._id));
        }).catch((err) => console.log(err));
    }

    function handleUpdateUser(user) {
        api.patchUserInfo(user).then(res => {
            setCurrentUser(res);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        })
    }

    function handleUpdateAvatar(user) {
        api.setUserAvatar(user.avatar).then(res => {
            setCurrentUser(res);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        })
    }

    function handleAddPlace(card) {
        api.postCard(card).then(res => {
            setCards([res, ...cards]);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Main onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
            />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                             onUpdateAvatar={handleUpdateAvatar}/>
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace}/>
            <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups}
            />
            <div className="popup popup_type_delete">
                <div className="popup__overlay"></div>
                <div className="popup__container">
                    <button className="popup__button-close" type="button"></button>
                    <h3 className="popup__title">Вы уверенны?</h3>
                    <button type="button" className="popup__button popup__button-confirm">Да</button>
                </div>
            </div>
        </CurrentUserContext.Provider>
    )
}

export default MainPage;