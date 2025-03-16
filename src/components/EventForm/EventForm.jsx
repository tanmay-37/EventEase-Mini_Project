import {useState , useContext} from 'react';
import {useNavigate} from 'react-router-dom'
import { EventContext } from '../../contexts/EventContext';

//Usage of useNavigate

// You can use useNavigate to navigate to another route when a button is clicked, after a form submission, or based on some logic in your app.

const EventForm = () => {

    // structure/template of event card
    const [formData , setFormData] = useState({
        title: '',
        image:'',
        description:'',
        date:'',
        venue:'',
        registrationLink:'',
    });

    const {addEvent , seytIsModalOpen} = useContext(EventContext);
    const navigate = useNavigate();

    // handling submit actions on button
    const handleSubmit = (e) => {
        e.preventDefault();
        addEvent({...formData , id:Date.now()});
        seytIsModalOpen(false);
        navigate('/events');
    };

    // return form component

    return (
        <div className='modal'>
            <form onSubmit={handleSubmit}>

                <input 
                    type="text"
                    placeholder='Event Title'
                    value = {FormData.title}
                    onChange = {(e) => setFormData({ ...formData , title: e.target.value})}
                    required
                />

                <input
                    type="url"
                    placeholder = "Image URL"
                    value = {formData.image}
                    onChange = {(e) => setFormData({ ...formData , image:e.target.value})}
                    required
                />

                <textarea 
                    placeholder = "Description"
                    value = {formData.description}
                    onChange = {(e) => setFormData({ ...formData , description: e.target.value })}
                    required
                                
                />

                <input 
                    type="date" 
                    value = {formData.date}
                    onChange = {(e) => setFormData({ ...formData , date: e.target.value})}
                    required                
                />

                <input 
                    type="text"
                    placeholder="Venue"
                    value={formData.venue}
                    onChange = {(e) => setFormData({ ...formData , vecnue: e.target.value})} 
                    required   
                />

                <input 
                    type="url" 
                    placeholder = "Registration Link" 
                    value = {formData.link}
                    onChange = {(e) => setFormData({ ...formData , link: e.target.value})}   
                    required                    
                />

                <button type='submit'>Create Event</button>
            </form>
        </div>
    )
}

export default EventForm;


