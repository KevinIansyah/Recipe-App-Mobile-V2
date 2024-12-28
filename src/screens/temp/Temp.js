const handleBookmark = async () => {
  if (!user?.id || !token || !recipe.id) {
    alert('Data not found');
    return;
  }

  const formData = new FormData();

  formData.append('user_id', user.id);
  formData.append('recipe_id', recipe.id);

  try {
    const response = await axios.post(
      `https://recipe.keviniansyah.com/api/like`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to bookmark', error);
  }
};

const fetchCheckBookmark = async () => {
  if (!user?.id || !token || !recipe.id) {
    alert('Data not found');
    return;
  }

  try {
    const response = await axios.get(
      `https://recipe.keviniansyah.com/api/bookmark?user_id=${user.id}&recipe_id=${recipe.id}&check_bookmark=y`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch bookmark status', error);
  }
};
