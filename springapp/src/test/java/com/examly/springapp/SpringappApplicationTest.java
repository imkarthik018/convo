package com.examly.springapp;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import java.io.File;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class SpringappConversationTests {

    @Autowired
    private MockMvc mockMvc;

    // ---------- Core API Tests ----------

    @Order(1)
    @Test
    void AddConversationReturns200() throws Exception {
        String conversationData = """
                {
                    "prompt": "Hello GPT",
                    "response": "Hi there!",
                    "category": "General",
                    "timestamp": "2025-09-04T12:00:00"
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/chats/addConversation")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(conversationData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(jsonPath("$.prompt").value("Hello GPT"))
                .andExpect(jsonPath("$.response").value("Hi there!"))
                .andReturn();
    }

    @Order(2)
    @Test
    void GetAllConversationsReturnsArray() throws Exception {
        mockMvc.perform(get("/api/chats/allConversations")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    @Order(3)
    @Test
    void GetConversationsByCategoryReturns200() throws Exception {
        mockMvc.perform(get("/api/chats/byCategory")
                        .with(jwt())
                        .param("category", "General")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].prompt").exists())
                .andReturn();
    }

    @Order(4)
    @Test
    void GetConversationsSortedByTimeReturns200() throws Exception {
        mockMvc.perform(get("/api/chats/sortedByTime")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    // ---------- Project Structure Tests ----------

    @Test
    void ControllerDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/controller";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ConversationControllerFileExists() {
        String filePath = "src/main/java/com/examly/springapp/controller/ConversationController.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void ModelDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/model";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ConversationModelFileExists() {
        String filePath = "src/main/java/com/examly/springapp/model/Conversation.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void RepositoryDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/repository";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ServiceDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ConversationServiceClassExists() {
        checkClassExists("com.examly.springapp.service.ConversationService");
    }

    @Test
    void ConversationModelClassExists() {
        checkClassExists("com.examly.springapp.model.Conversation");
    }

    @Test
    void ConversationModelHasPromptField() {
        checkFieldExists("com.examly.springapp.model.Conversation", "prompt");
    }

    @Test
    void ConversationModelHasResponseField() {
        checkFieldExists("com.examly.springapp.model.Conversation", "response");
    }

    @Test
    void ConversationModelHasCategoryField() {
        checkFieldExists("com.examly.springapp.model.Conversation", "category");
    }

    @Test
    void ConversationModelHasTimestampField() {
        checkFieldExists("com.examly.springapp.model.Conversation", "timestamp");
    }

    @Test
    void ConversationRepoExtendsJpaRepository() {
        checkClassImplementsInterface("com.examly.springapp.repository.ConversationRepository",
                "org.springframework.data.jpa.repository.JpaRepository");
    }

    // ---------- Helpers ----------

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " in class " + className + " does not exist.");
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> interfaceClazz = Class.forName(interfaceName);
            assertTrue(interfaceClazz.isAssignableFrom(clazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or interface " + interfaceName + " does not exist.");
        }
    }
}
