export default function getTimeDiff(createdAt) {
    const now = new Date();
    const createdDate = new Date(createdAt * 1000);
    const diffMillis = now - createdDate;

    const minuteInMillis = 60 * 1000;
    const hourInMillis = 60 * minuteInMillis;
    const dayInMillis = 24 * hourInMillis;

    if (diffMillis < minuteInMillis) {
      return "just now";
    } else if (diffMillis < hourInMillis) {
      const minutesAgo = Math.floor(diffMillis / minuteInMillis);
      return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
    } else if (diffMillis < dayInMillis) {
      const hoursAgo = Math.floor(diffMillis / hourInMillis);
      return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
    } else {
      const daysAgo = Math.floor(diffMillis / dayInMillis);
      return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
    }
  }