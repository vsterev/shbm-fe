import { View, Text, Image } from 'reshaped';

const NotFound = () => {
  return (
    <View height={100} width="100%" justify="center" align="center" gap={5}>
      <Image src="public/images/not-found.png" height={100} />
      <Text variant="title-4" color="neutral-faded">
        404 - Page not found
      </Text>
    </View>
  );
};
export default NotFound;
