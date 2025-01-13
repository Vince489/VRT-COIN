// src/utils/avatar.js

function getAvatarColor(username) {
    const colors = {
        "a-d": "bg-red-500",
        "e-h": "bg-blue-500",
        "i-l": "bg-green-500",
        "m-p": "bg-yellow-500",
        "q-t": "bg-purple-500",
        "u-x": "bg-pink-500",
        "y-z": "bg-orange-500",
    };

    if (!username || typeof username !== "string") {
        return "bg-gray-500"; // Default color for no username
    }

    const firstLetter = username[0].toLowerCase();

    for (const [group, color] of Object.entries(colors)) {
        const [start, end] = group.split("-");
        if (firstLetter >= start && firstLetter <= end) {
            return color;
        }
    }

    return "bg-gray-500"; // Fallback color
}

module.exports = { getAvatarColor };
