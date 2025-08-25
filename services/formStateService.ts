import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateFormState } from '../types/payment';

const FORM_STATE_KEY = 'create_form_state';

export class FormStateService {
  /**
   * Get initial form state
   */
  static getInitialFormState(): CreateFormState {
    return {
      media: null,
      description: '',
      tags: [],
      reward: 500,
      questions: [],
    };
  }

  /**
   * Save form state to AsyncStorage
   */
  static async saveFormState(state: CreateFormState): Promise<void> {
    try {
      await AsyncStorage.setItem(FORM_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save form state:', error);
    }
  }

  /**
   * Load form state from AsyncStorage
   */
  static async loadFormState(): Promise<CreateFormState | null> {
    try {
      const state = await AsyncStorage.getItem(FORM_STATE_KEY);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Failed to load form state:', error);
      return null;
    }
  }

  /**
   * Clear form state from AsyncStorage and reset to initial state
   */
  static async clearFormState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FORM_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear form state:', error);
    }
  }

  /**
   * Reset form to initial state (both in memory and storage)
   */
  static async resetFormState(): Promise<CreateFormState> {
    const initialState = this.getInitialFormState();
    await this.clearFormState();
    await this.saveFormState(initialState);
    return initialState;
  }

  /**
   * Validate form state
   */
  static validateFormState(state: CreateFormState): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!state.media) {
      errors.push('Please upload a media file');
    }

    if (state.reward < 500) {
      errors.push('Reward must be at least $5.00');
    }

    if (state.description.length > 1000) {
      errors.push('Description must not exceed 1000 characters');
    }

    if (state.tags.some(tag => tag.length > 255)) {
      errors.push('Each tag must not exceed 255 characters');
    }

    if (state.questions.some(q => q.question.length > 1000)) {
      errors.push('Question text must not exceed 1000 characters');
    }

    if (state.questions.some(q => q.options.some(opt => opt.length > 255))) {
      errors.push('Answer options must not exceed 255 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert form state to payment metadata
   */
  static convertToPaymentMetadata(state: CreateFormState) {
    return {
      description: state.description,
      tags: state.tags,
      reward: state.reward,
      questions: state.questions.map(quiz => ({
        question: quiz.question,
        answer: String.fromCharCode(65 + quiz.correctAnswer),
        option_a: quiz.options[0],
        option_b: quiz.options[1],
        option_c: quiz.options[2],
        option_d: quiz.options[3],
      }))
    };
  }
} 