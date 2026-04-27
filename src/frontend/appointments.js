




    const appointment = {
        id: Date.now(),
        date: new Date(),
        patient: patientName,
        doctor: doctorName
    };

    appointments.push(appointment);
    return appointment;