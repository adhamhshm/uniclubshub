import "./confirmbox.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from 'react';
import { makeRequest } from "../../../request";

const ConfirmBox = ({ postData, currentUser, setShowPostModal, socket }) => {

    // Create a ref to hold a reference to the modal container
    const modalRef = useRef(null);
    const queryClient = useQueryClient();

    // Function to handle clicks outside the modal
    const handleOutsideClick = (event) => {
        // Check if the modalRef exists and if the clicked element is outside the modal
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            // If the click is outside, close the modal
            setShowPostModal(false);
        }
    };

    // Registering for an event mutation, need to refetch as once registered, cannot registere again
    const registerEventMutation = useMutation((registerConfirmation) => {
        return makeRequest.post("/events/register", registerConfirmation);
    },
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "events" })
        },
    });

    // Adding info to activities
    const addActivitiesMutation = useMutation((activityInfo) => {
        return makeRequest.post("/activities", activityInfo);
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "activities" })
        },
    });

    const handleConfirm = () => {
        handleNotification("register");
        registerEventMutation.mutate({ postId: postData.id, participantId: currentUser.id });
        setShowPostModal(false);
        addActivityInfo();
    };

    const addActivityInfo = async () => {
        addActivitiesMutation.mutate({ receiverUserId: postData.userId, postId: postData.id, senderUserId: currentUser.id, activityType: "register" });
    };

    const handleNotification = (activityType) => {
        // Send the notification data to the server
        socket?.emit("sendNotification" , {
            senderUserId: currentUser.id,
            receiverUserId: postData.userId,
            activityType,
        })
    };

    // Attach a 'mousedown' event listener to the document to call handleOutsideClick
    document.addEventListener('mousedown', handleOutsideClick);


    return (
        <div className="post-modal">
            {/* Attach the ref to the container */}
            <div className="post-modal-container" ref={modalRef}>
                <div>
                    <h1>Register event?</h1>
                    <p>
                        Are you interested?
                        Your information will be shared with the organizer as interested participants. <br/><br/>
                        Click the button below to confirm your registration for {postData.title}.
                    </p>
                </div>
                <div className="post-modal-wrapper">
                    <div className="modal-confirm-button">
                        <button onClick={handleConfirm}>
                            Confirm
                        </button>
                    </div>
                </div>
                <img id="close" src="/default/cross.svg" alt="cross" onClick={() => setShowPostModal(false)} />
            </div>
        </div>
    );
};

export default ConfirmBox;