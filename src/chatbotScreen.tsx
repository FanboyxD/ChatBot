import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import { sendMessage } from './openaiService';

const ChatbotScreen: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = async () => {
    if (!input) return;
    setMessages((prev) => [...prev, `You: ${input}`]);

    try {
      const response = await sendMessage(input);
      setMessages((prev) => [...prev, `Bot: ${response}`]);
    } catch (error) {
      setMessages((prev) => [...prev, 'Bot: Error al obtener respuesta']);
    }

    setInput('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        {messages.map((msg, index) => (
          <Text key={index} style={{ marginBottom: 10 }}>
            {msg}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      <Button title="Enviar" onPress={handleSend} />
    </View>
  );
};

export default ChatbotScreen;
