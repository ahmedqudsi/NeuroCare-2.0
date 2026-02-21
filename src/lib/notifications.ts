
export const sendBookingConfirmation = (patientName: string, doctorName: string, dateTime: string) => {
  console.log(`Booking confirmation sent to ${patientName} for appointment with ${doctorName} on ${dateTime}`);
};

export const sendReminder = (patientName: string, doctorName: string, dateTime: string) => {
  console.log(`Reminder sent to ${patientName} for appointment with ${doctorName} on ${dateTime}`);
};
