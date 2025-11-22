# fetchScoreFromAWS のレスポンス例

```
{
    "snippet_index": "// スニペットを読み込む\nasync function loadSnippet() {\n\tconst docs = await getSnippet();\n\tsetSnippets(docs);\n}\nconst { sendMessage } = useWebSocket({\n\turl: \"wss://etuqhxwxk1.execute-api.ap-northeast-1.amazonaws.com/Prod/\",\n\tonMessage: (data) => {\n\t\tsetNotification(data);\n\t\tloadSnippet();\n\t},\n});\nconst scores: [number, number, number] = [100000, 1000, 10030];\n\nuseEffect(() => {\n\tloadSnippet();\n}, []);\n\nreturn (\n\t<>\n\t\t{notification && (\n\t\t\t<Notification\n\t\t\t\ttitle={notification.title}\n\t\t\t\tcontent={notification.content}\n\t\t\t\tsnippetScore={notification.snippetScore}\n\t\t\t\tonClose={() => setNotification(null)}\n\t\t\t/>\n\t\t)}\n\t\t<div style={{ backgroundColor: \"#efefef\" }}>\n\t\t\t<PlanetaryComparison score={scores} />\n\t\t\t<EngineerComparisonProgress comparison={topEngineerData} />\n\t\t\t<EngineerComparisonProgress comparison={surroundingEngineerData} />\n\t\t\t{snippets.length > 0\n\t\t\t\t? snippets.map((snippet, index) => (\n\t\t\t\t\t<div key={snippet.id}>\n\t\t\t\t\t\t<SnippetCard\n\t\t\t\t\t\t\tid={snippet.id}\n\t\t\t\t\t\t\ttitle={snippet.data.title}\n\t\t\t\t\t\t\tcontent={snippet.data.content}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t))\n\t\t\t\t: \"No data loaded.\"}\n\t\t</div>\n\t\t<EditButton onClick={() => setIsFormVisible(true)} />\n\t\t<EditForm\n\t\t\tisOpen={isFormVisible}\n\t\t\tonClose={() => setIsFormVisible(false)}\n\t\t\tsendMessage={sendMessage}\n\t\t\tloadSnippet={loadSnippet}\n\t\t/>\n\t</>\n);",
    "character_count": 1370,
    "scores": {
        "learning_depth": 0.6,
        "expertise_level": 0.8,
        "conciseness": 0.7,
        "clarity_logic": 0.8
    },
    "calculation_steps": {
        "average_quality_score": "AVG(0.6, 0.8, 0.7, 0.8)",
        "weighted_score": "0.725 * 1370"
    },
    "final_results": {
        "average_quality_score": 0.725,
        "final_weighted_score": 993.25
    },
    "justification": {
        "learning_depth": "Moderate depth, lacks detailed insights.",
        "expertise_level": "Uses relevant tech terms, suitable for engineers.",
        "conciseness": "Efficient, but could be more concise.",
        "clarity_logic": "Well-structured, logical flow."
    }
}
```
