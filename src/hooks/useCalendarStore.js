import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store';
import { calendarApi } from '../api';
import { convertDateToJsDate } from '../helpers/convertDateToJsDate';
import Swal from 'sweetalert2';


export const useCalendarStore = () => {
  
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const {user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) => {
        // Todo bien
        try {
            if( calendarEvent.id ) {
                // Actualizando
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch( onUpdateEvent({ ...calendarEvent }) );
                return;
            } 
            // Creando
            const {data}= await calendarApi.post('/events',calendarEvent);
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user}) );
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar',error.response.data.msg,'error');
        }
    }

    const startDeletingEvent = () => {
        // Todo: Llegar al backend


        dispatch( onDeleteEvent() );
    }

    const starLoadingEvents = async()=>{
        try {
            const {data} = await calendarApi.get('/events');
            console.log(data);
            const events = convertDateToJsDate(data.eventos); 
            dispatch(onLoadEvents(events))
        } catch (error) {
            console.log(error);
        }
    }

    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //* Métodos
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
        starLoadingEvents,
    }
}
