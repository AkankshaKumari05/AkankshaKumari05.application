package com.example.myapplication.common;
import java.util.List;
import java.util.stream.Collectors;

public class AutocompleteResult {
    private String displaySymbol;

    private String description;

    public String getFormattedText() {
        return String.format("%s | %s", displaySymbol, description);
    }

    public static List<String> getFormattedOptions(List<AutocompleteResult> autocompleteResults) {
        return autocompleteResults.stream().map(AutocompleteResult::getFormattedText).collect(Collectors.toList());
    }

    public static String extractTickerFromFormattedOption(String formattedOption) {
        return formattedOption.split(" | ")[0];
    }
}