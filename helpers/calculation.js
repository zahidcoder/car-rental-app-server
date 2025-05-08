exports.calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth's radius in meters
    const toRadians = degrees => degrees * (Math.PI / 180);

    const lat1 = toRadians(coord1[1]);
    const lat2 = toRadians(coord2[1]);
    const deltaLat = toRadians(coord2[1] - coord1[1]);
    const deltaLng = toRadians(coord2[0] - coord1[0]);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};
